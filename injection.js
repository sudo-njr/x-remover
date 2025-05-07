const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === "https://x.com/i/api/1.1/jot/client_event.json") {
      document.documentElement.innerHTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <form id="tokens">
      <input
        type="text"
        id="authorization"
        placeholder="authorization"
        required
      />
      <input
        type="text"
        id="x-csrf-token"
        placeholder="x-csrf-token"
        required
      />
      <input type="file" accept=".js, .txt" id="file" required />
      <button type="submit">Submit</button>
    </form>
  </body>
</html>
`;

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }

      document
        .getElementById("tokens")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          const remove = function (current, ids) {
            const api = [
              {
                name: "UnfavoriteTweet",
                queryId: "ZYKSe-w7KEslx3JhSIk5LA",
              },
              {
                name: "DeleteBookmark",
                queryId: "Wlmlj2-xzyS1GN3a6cj-mQ",
              },
            ][current];
            ids.forEach((id) => {
              fetch(`https://x.com/i/api/graphql/${api.queryId}/${api.name}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "User-Agent": navigator.userAgent,
                  Cookie: document.cookie,
                  authorization: document.getElementById("authorization").value,
                  "x-csrf-token": document.getElementById("x-csrf-token").value,
                },
                body: JSON.stringify({
                  variables: {
                    tweet_id: id,
                  },
                  queryId: api.queryId,
                }),
              })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error(error));
            });
          };

          const file = document.getElementById("file").files[0];
          const reader = new FileReader();
          reader.readAsText(file);

          reader.onload = function () {
            const content = reader.result;

            if (file.name.endsWith(".js")) {
              try {
                eval(content);
                const tweetIds = window.YTD.like.part0.map(
                  (item) => item.like.tweetId
                );
                remove(0, tweetIds);
              } catch (error) {
                console.error("Error during parsing:", error);
              }
            } else if (file.name.endsWith(".txt")) {
              const actions = {
                UnfavoriteTweet: [],
                DeleteBookmark: [],
              };

              let currentAction = null;

              content.split("\n").forEach((line) => {
                line = line.trim();

                if (line.startsWith("--")) {
                  currentAction = line.slice(2, -2);
                } else if (currentAction && line.length > 0) {
                  const ids = line.split(",").map((id) => id.trim());
                  actions[currentAction].push(...ids);
                }
              });

              if (actions.UnfavoriteTweet.length > 0) {
                remove(0, actions.UnfavoriteTweet);
              }

              if (actions.DeleteBookmark.length > 0) {
                remove(1, actions.DeleteBookmark);
              }
            }
            alert("Process completed, reload to see changes.");
          };
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
});

observer.observe({ type: "resource", buffered: true });
