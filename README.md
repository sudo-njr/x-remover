# X-Remover

This is a tool to remove likes and bookmarks easier and more efficent that runs completely on your browser's client, you won't need to surf around the developer tab and gather all your cookies or find your authentication tokens to remove them at a bulk. If this is what your looking for, this tool was made for you!

## Getting likes

### Easy - Download your Twitter account archive (24+ hours)

0. According to X, your archive can take longer than 24 hours.
1. On the sidebar go to "More" - "Settings and privacy"
2. In the settings go to "Your account" - "Download an archive of your data"
3. Download and unzip your archive and locate `/data/likes.js`, which includes your favorited tweets.

### Intermediate - Locating Tweets in the Network tab. (~5 minutes)

0. This way is generally not **recomended** because favorites load asyncronously, meaning when you scroll more tweets load which makes new requests to the server. If you have alot of favorites then you shouldn't take this route.
1. Go to "Profile" - "Likes" to see all of your favorited content.
2. Open Developer Tools and open the "Network" tab and filter for `Likes` and Content-Type `application/json`.
3. Scroll down to load tweets, newer requests include more favorited information in the response.
4. Once in the file, search for the `entryId` property and `tweetDisplayType: "Tweet"`.
5. The `entryId` is a tweet id, add your selection to [a text file](#storing-in-a-text-file) (only option if you want to get the results faster, otherwise try the archive method.)

The file will look something like this.

```json
{
  "data": {
    "user": {
      "result": {
        "__typename": "User",
        "timeline": {
          "timeline": {
            "instructions": [
              {
                "type": "TimelineAddEntries",
                "entries": [
                  {
                    "entryId": "tweet-ID",
                    "content": {
                      "itemContent": {
                        "tweetDisplayType": "Tweet"
                      }
                    }
                  },
                  {
                    "entryId": "cursor-top-1234567891234567891",
                    "content": {}
                  },
                  {
                    "entryId": "cursor-bottom-1234567891234567891",
                    "content": {}
                  }
                ]
              }
            ],
            "metadata": { "scribeConfig": { "page": "favorites" } }
          }
        }
      }
    }
  }
}
```

## Getting bookmarks

### Hard - Locating bookmarks in the Network tab. (~5 minutes, only option)

1. Go to the "Bookmarks" page to see your bookmarks.
2. Open Developer Tools and open the "Network" tab and filter for `Bookmarks` and Content-Type `application/json`.
3. Scroll down to load tweets, newer requests include more bookmarks in the response.
4. Once in the file, search for the `entryId` property and `tweetDisplayType: "Tweet"`.
5. The `entryId` is a tweet id, add your selection to [a text file](#storing-in-a-text-file) (only option currently)

The file will look something like this.

```json
{
  "data": {
    "bookmark_timeline_v2": {
      "timeline": {
        "instructions": [
          {
            "type": "TimelineAddEntries",
            "entries": [
              {
                "entryId": "tweet-ID",
                "content": {
                  "itemContent": {
                    "tweetDisplayType": "Tweet"
                  }
                }
              },
              {
                "entryId": "cursor-top-1234567891234567891",
                "content": {}
              },
              {
                "entryId": "cursor-bottom-1234567891234567891",
                "content": {}
              }
            ]
          }
        ],
        "responseObjects": { "feedbackActions": [], "immediateReactions": [] }
      }
    }
  }
}
```

## Storing in a text file

Do not include the tweet prefix.

```txt
--UnfavoriteTweet--
1234567891234567891, 1234567891234567891
--DeleteBookmark--
1234567891234567891, 1234567891234567891
```

## Removing the data

1. Copy the contents of [injection.js](https://github.com/sudo-njr/x-remover/blob/main/injection.js)
2. On X, Open **Developer Tools** and paste it into the console.
3. Go to Network tab and go to any request scroll down to request headers. Copy "authorization" and "x-csrf-token".
4. Paste these into the form. You can only upload one file at a time: either `likes.js` or a `.txt` file.
5. Reload the page when prompted and it should be wiped off your account.
