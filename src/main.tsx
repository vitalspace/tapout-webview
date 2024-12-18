import "./createPost.js";

import { Devvit, useState } from "@devvit/public-api";

Devvit.configure({
  redditAPI: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: "Tap Out",
  height: "tall",
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? "anon";
    });

    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage("myWebView", {
        type: "initialData",
        data: {
          username: username,
        },
      });
    };
    const onMessage = (msg: any) => {
      switch (msg.type) {
        case "getUserName": {
          context.ui.webView.postMessage("myWebView", {
            type: "initialData",
            data: {
              username: username,
            },
          });
          break;
        }
      }
    };

    // Render the custom post type
    return (
      <vstack grow padding="small">
        {!webviewVisible && (
          <zstack
            grow={!webviewVisible}
            height={webviewVisible ? "0%" : "100%"}
          >
            <image
              url={context.assets.getURL("tapout.png")}
              height="100%"
              width="100%"
              resizeMode="cover"
              imageWidth={1344}
              imageHeight={768}
            />
            <vstack alignment="middle center" height="100%" width="100%">
              <button
                appearance="success"
                onPress={onShowWebviewClick}
                size="large"
              >
                Play
              </button>
            </vstack>
          </zstack>
        )}
        {webviewVisible && (
          <vstack grow height="100%">
            <vstack border="thick" borderColor="black" height="100%">
              <webview
                id="myWebView"
                url="page.html"
                onMessage={(msg) => onMessage(msg)}
                grow
                height="100%"
              />
            </vstack>
          </vstack>
        )}
      </vstack>
    );
  },
});

export default Devvit;
