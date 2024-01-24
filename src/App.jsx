import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import IconBxSearch from './IconBxSearch';
import IconBxChat from './IconBxChat';
import IconBxsInbox from './IconBxsInbox';
import IconBxCrown from './IconBxCrown';
import IconBxDiamond from './IconBxDiamond';
import IconBxsBatteryCharging from './IconBxsBatteryCharging';
import IconBxDotsVerticalRounded from './IconBxDotsVerticalRounded';
import IconBxHeart from './IconBxHeart';

let clientId = "egxcai0act4gxendn45lv6faqcvwhi";
let clientSecret = "8c5iuv43t50au8n17didvt6kv9zyvq";

function getTwitchAuthorization() {
	let url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

	return fetch(url, {
		method: "POST",
	})
		.then((res) => res.json())
		.then((data) => {
			return data;
		});
}

function App() {
	const [searchTermValue, setSearchTerm] = useState("");
	const [streamsData, setStreamsData] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [showStreams, setShowStreams] = useState(true);
	const [twitchEmbedInitialized, setTwitchEmbedInitialized] = useState(false);
	const [selectedStream, setSelectedStream] = useState(null);

	const twitchEmbedContainerRef = useRef(null);

	const handleSearch = async (event) => {
		event.preventDefault();
		const searchTermValue = document.getElementById("search").value;

		if (searchTermValue.trim() !== "") {
			setSearchTerm(searchTermValue);
			await getStreams(searchTermValue);
		} else {
			window.location.reload()
		}
	};

	const handleProfileClick = (index) => {

		const selectedProfile = searchTermValue ? searchResults[index] : streamsData[index];

		if (selectedProfile && selectedProfile.display_name) {
			initializeTwitchEmbed(selectedProfile.display_name);
			setShowStreams(false);
			setTwitchEmbedInitialized(true);
		} else {
			console.error('Invalid profile data:', selectedProfile);
		}
	};

	const initializeTwitchEmbed = (channelName) => {

		if (!channelName) {
			console.error('Invalid channelName:', channelName);
			return;
		}

		const twitchEmbed = new Twitch.Embed('twitch-embed', {
			width: '100%',
			height: window.innerHeight - 50,
			channel: channelName,
		});
	};

	// Top 20 streams
	useEffect(() => {
		const fetchData = async () => {
			try {
				const authorizationObject = await getTwitchAuthorization();
				const { access_token } = authorizationObject;

				const response = await fetch('https://api.twitch.tv/helix/streams', {
					headers: {
						'Client-ID': clientId,
						'Authorization': `Bearer ${access_token}`,
					},
				});

				const data = await response.json();
				setStreamsData(data.data); // Update the streamsData state
			} catch (error) {
				console.error('Error fetching stream data:', error);
			}
		};

		fetchData(); // Call the fetchData function
	}, []);


	// Search Profiles
	const getStreams = async (username) => {
		try {
			let authorizationObject = await getTwitchAuthorization();
			let { access_token, expires_in, token_type } = authorizationObject;

			token_type =
				token_type.substring(0, 1).toUpperCase() +
				token_type.substring(1, token_type.length);

			let authorization = `${token_type} ${access_token}`;

			let headers = {
				authorization,
				"Client-Id": clientId,
			};

			let endpoint;

			if (username) {
				// If a search term is provided, fetch search results
				endpoint = `https://api.twitch.tv/helix/search/channels?query=${username}`;
			} else {
				// Fetch the top 20 streams
				endpoint = "https://api.twitch.tv/helix/streams";
			}

			const response = await fetch(endpoint, {
				headers,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			data.data.sort((a,b) => {return a.display_name.toUpperCase() != username.toUpperCase()});

			const renderSearchResults = (searchResultsData) => {
				setSearchResults(searchResultsData.map((result) => ({
					thumbnail: result.thumbnail_url.replace("{width}", "720").replace("{height}", "720"),
					liveBadge: result.is_live ? <span className="live">LIVE</span> : null,
					display_name: result.display_name,
				})));
			};

			if (username) {
				renderSearchResults(data.data);
			} else {
				setStreamsData(data.data.map((result) => ({
					thumbnail: result.thumbnail_url.replace("{width}", "720").replace("{height}", "720"),
					liveBadge: result.is_live ? <span className="live">LIVE</span> : null,
					display_name: result.user_name,
				})));
			}
		} catch (error) {
			console.error('Error fetching streams:', error);
		}
	};

	return (
		<>
			<header>
				<div id='row1'>
					<div className='nav-item'><img id='logo-img' src="./Twitch-icon-purple.png" alt="Logo-twitch" /></div>
					<div className='nav-item' id='purple'>Volgend</div>
					<div className='nav-item' id='not-purple'>Bladeren</div>
					<div className='nav-item' id='dots'><IconBxDotsVerticalRounded width='24px' height='24px' /></div>
				</div>
				<div id='row2'>
					<div className='nav-item'>
						<form onSubmit={handleSearch} method='post'>
							<input type="text" name="search" id="search" placeholder='Zoeken' />
							<button type='submit' id='search-icon'><IconBxSearch width='20px' height='20px' /></button>
						</form>
					</div>
				</div>
				<div id='row3'>
					<div className='nav-item'><IconBxCrown width='24px' height='24px' /></div>
					<div className='nav-item'><IconBxsInbox width='24px' height='24px' /></div>
					<div className='nav-item'><IconBxChat width='24px' height='24px' /></div>
					<div className='nav-item'><IconBxDiamond width='24px' height='24px' /></div>
					<div className='nav-item'><IconBxsBatteryCharging width='24px' height='24px' /></div>
					<div className='nav-item'><img id='profile-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="profile-picture" /></div>
				</div>
			</header>

			<nav>
				<IconBxHeart id="heart-icon" width='20px' height='20px' />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
				<img className='side-nav-img' src="./hampter-fd851f66e508138ed814373c9d8568d4-meme.jpeg" alt="bruh" />
			</nav>

			<div className={showStreams ? 'top-text' : 'hidden'}>
				<h1 id='pagetitle'>Volgend</h1>
				<div id='list'>
					<div className='list-item'>Overzicht</div>
					<div className='list-item'>Live</div>
					<div className='list-item'>Video's</div>
					<div className='list-item'>Categoriёn</div>
					<div className='list-item'>Kanalen</div>
				</div>
			</div>
			{/* Searched or Not Searched results in class streams */}
			<div className={`streams ${showStreams && !twitchEmbedInitialized ? '' : 'hidden'}`}>
				{searchTermValue ? (
					searchResults.map((result, index) => (
						<div key={index} className="stream-profile-container" onClick={() => handleProfileClick(index)}>
							<div className="image-profile-container">
								<img src={result.thumbnail} alt={result.display_name}/>
								<div className={result.liveBadge ? 'border' : 'hidden'}></div>
							</div>
							<div className={"text=profile-container " + (result.liveBadge ? 'live' : '')}>
								<h3>{result.display_name}</h3>
							</div>
						</div>
					))
				) : (
					streamsData.map((stream, index) => (
						<div key={index} className="stream-streams-item">
							<div className="stream-streams-container">
								<div className="image-streams-container">
									<span className="live">LIVE</span>
									<img
										src={stream.thumbnail_url.replace("{width}", "1280").replace("{height}", "720")}
										alt={stream.user_name}
									/>
									<svg viewBox="0 0 15 15" fill="none" xmlns="http:www.w3.org/2000/svg" width="15" height="15">
										<path
											d="M.5 7.5l-.464-.186a.5.5 0 000 .372L.5 7.5zm14 0l.464.186a.5.5 0 000-.372L14.5 7.5zm-7 4.5c-2.314 0-3.939-1.152-5.003-2.334a9.368 9.368 0 01-1.449-2.164 5.065 5.065 0 01-.08-.18l-.004-.007v-.001L.5 7.5l-.464.186v.002l.003.004a2.107 2.107 0 00.026.063l.078.173a10.368 10.368 0 001.61 2.406C2.94 11.652 4.814 13 7.5 13v-1zm-7-4.5l.464.186.004-.008a2.62 2.62 0 01.08-.18 9.368 9.368 0 011.449-2.164C3.56 4.152 5.186 3 7.5 3V2C4.814 2 2.939 3.348 1.753 4.666a10.367 10.367 0 00-1.61 2.406 6.05 6.05 0 00-.104.236l-.002.004v.001H.035L.5 7.5zm7-4.5c2.314 0 3.939 1.152 5.003 2.334a9.37 9.37 0 011.449 2.164 4.705 4.705 0 01.08.18l.004.007v.001L14.5 7.5l.464-.186v-.002l-.003-.004a.656.656 0 00-.026-.063 9.094 9.094 0 00-.39-.773 10.365 10.365 0 00-1.298-1.806C12.06 3.348 10.186 2 7.5 2v1zm7 4.5a68.887 68.887 0 01-.464-.186l-.003.008-.015.035-.066.145a9.37 9.37 0 01-1.449 2.164C11.44 10.848 9.814 12 7.5 12v1c2.686 0 4.561-1.348 5.747-2.665a10.366 10.366 0 001.61-2.407 6.164 6.164 0 00.104-.236l.002-.004v-.001h.001L14.5 7.5zM7.5 9A1.5 1.5 0 016 7.5H5A2.5 2.5 0 007.5 10V9zM9 7.5A1.5 1.5 0 017.5 9v1A2.5 2.5 0 0010 7.5H9zM7.5 6A1.5 1.5 0 019 7.5h1A2.5 2.5 0 007.5 5v1zm0-1A2.5 2.5 0 005 7.5h1A1.5 1.5 0 017.5 6V5z"
											fill="currentColor"
										></path>
									</svg>
									<span className='view-count'>{stream.viewer_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
								</div>
								<div className="text-streams-container">
									<h4>{stream.title}</h4>
									<h3>{stream.user_name}</h3>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Twitch Embed container */}
			<div
				ref={twitchEmbedContainerRef}
				id="twitch-embed"
				className={`iframe-container ${twitchEmbedInitialized ? 'show' : 'hide'}`}
			/>
		</>
	);
}

export default App;
