const presence = new Presence({
	clientId: "719784356725653504",
});

interface QuizletData {
	layer?: {
		path?: string;
		event: string;

		studyableTitle?: string;
		studyableType?: string;
	};
	searchLayer?: {
		search_term: string;
	};
}
/* eslint-enable camelcase */

let qzData: QuizletData = null,
	actionTimestamp: number = null;

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/5K8iXcX.png",
		},
		buttons = await presence.getSetting<boolean>("buttons");

	if (qzData?.layer) {
		const pathSplits = qzData.layer.path.split("/");
		switch (pathSplits[0]) {
			case "StudyFeed":
				presenceData.details = "Dashboard";
				actionTimestamp = null;
				break;
			case "Settings":
				presenceData.details = "Settings";
				actionTimestamp = null;
				break;
			case "Profile":
				presenceData.details = "Viewing profile";
				presenceData.state = document.querySelector(
					".ProfileHeader-username"
				).textContent;
				if (buttons) {
					presenceData.buttons = [
						{
							label: "View Profile",
							url: document.URL,
						},
					];
				}
				actionTimestamp = null;
				break;
			case "Topic":
				presenceData.details = "Browsing sets on";
				presenceData.state = document.querySelector("h1").textContent;
				actionTimestamp = null;
				break;
			case "Search":
				presenceData.smallImageKey = "search";
				presenceData.smallImageText = "Searching";
				presenceData.details = "Searching";
				presenceData.state = qzData.searchLayer.search_term;
				actionTimestamp = null;
				break;
			case "Sets":
				switch (pathSplits[1]) {
					case "show":
						actionTimestamp ??= Date.now();
						presenceData.details = "Viewing a set";
						presenceData.state = qzData.layer.studyableTitle;
						if (buttons) {
							presenceData.buttons = [
								{
									label: "View Set",
									url: document.URL,
								},
							];
						}
						break;
					case "new":
						presenceData.details = "Creating a set";
						actionTimestamp = null;
						break;
				}
				break;
			case "Gravity": // Set > Gravity
				actionTimestamp ??= Date.now();
				presenceData.smallImageKey = "gravity";
				presenceData.smallImageText = "Gravity";
				presenceData.details = "Playing Gravity";
				presenceData.state = `with "${qzData.layer.studyableTitle}" set`;
				break;
			case "Match": // Set > Match
				actionTimestamp ??= Date.now();
				presenceData.smallImageKey = "match";
				presenceData.smallImageText = "Match";
				presenceData.details = "Playing Match";
				presenceData.state = `with "${qzData.layer.studyableTitle}" set`;
				break;
			case "LiveGame": // Set > Live
				actionTimestamp ??= Date.now();
				presenceData.smallImageKey = "live";
				presenceData.smallImageText = "Quizlet Live";
				presenceData.details = "Hosting a live game";
				presenceData.state = `with "${qzData.layer.studyableTitle}" set`;
				break;
			case "Assistant": // Set > Learn
				actionTimestamp ??= Date.now();
				presenceData.smallImageKey = "learn";
				presenceData.smallImageText = "Learn";
				presenceData.details = "Learning set";
				presenceData.state = qzData.layer.studyableTitle;
				break;
			case "Cards": // Set > Flashcards
				actionTimestamp ??= Date.now();
				presenceData.smallImageKey = "flashcards";
				presenceData.smallImageText = "Flashcards";
				presenceData.details = "Reviewing flashcards";
				presenceData.state = `on ${qzData.layer.studyableTitle}`;
				break;
			case "Test": // Set > Test
				actionTimestamp ??= Date.now();
				presenceData.smallImageKey = "test";
				presenceData.smallImageText = "Test";
				presenceData.details = "Testing";
				presenceData.state = `on ${qzData.layer.studyableTitle}`;
				break;
			case "Learn": // Set > Write
				actionTimestamp ??= Date.now();
				presenceData.smallImageKey = "write";
				presenceData.smallImageText = "Writing";
				presenceData.details = "Writing";
				presenceData.state = `on ${qzData.layer.studyableTitle}`;
				break;
			case "Spell": // Set > Spell
				actionTimestamp ??= Date.now();
				presenceData.smallImageKey = "spell";
				presenceData.smallImageText = "Spell";
				presenceData.details = "Spelling";
				presenceData.state = `on ${qzData.layer.studyableTitle}`;
				break;
		}
		presenceData.startTimestamp = actionTimestamp;
	}

	// If data doesn't exist clear else set activity to the presence data
	if (!presenceData.details) {
		// Clear tray
		presence.setActivity(); // Clear activity
	} else presence.setActivity(presenceData);
});

presence.on("iFrameData", (data: QuizletData) => {
	qzData = data;
});
