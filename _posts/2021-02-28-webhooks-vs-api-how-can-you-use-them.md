---
layout: post
title: 'Webhook vs API: How can you use them?'
date: 2021-02-26 22:17 -0500
categories:
- Tutorial
tags:
- Webhook
- REST API
- Python
label: new
author: Yu-Yueh Liu
---
Recently, I was asked what was the difference between Webhooks and APIs. This was a question I also had a few years ago when I started programming. In this article, I will briefly explain what they are and give an example of how you can use them.

### What is an API?
API stands for Application Programming Interface. APIs allow applications to talk with each other via a common communication method. There are a lot of different API architectural styles such as REST, SOAP, GraphQL and gRPC. With most APIs, there’s a request followed by a response.

For example, a restaurant might have an application that would make an API request to their server and obtain a list of menu items in the response, then display it for their users. A lot applications out there provide public APIs that you can be use in your personal projects such as [YouTube Data API][youtube-api] and [Google Map API][google-map-api].


### What is a Webhook?
Unlike APIs, Webhook is simply an HTTP POST request that is triggered automatically when an event occurs. Basically, webhooks are **"user-defined callbacks"**.

For example, an application could provide a webhook that will get triggered by another application when new data is received (callback) instead of sending requests at fixed interval to fetch new data (polling).


## Example

### Using Slack API with Slack Bot
Slack provides a complete list of [REST API methods][slack-api-list] available to bots. We are going to use the [users.list][users-list] method to list available users and [chat.postMessage][post-message] method to send a message to a user or channel.


1\. Navigate to the Custom Integrations page of your Workspace `https://<your-workspace-name>.slack.com/apps/manage/custom-integrations` and select ***Bots***
{% capture custom-integrations-bots %}{% asset_path custom-integrations-bots.png %}{% endcapture %}<a href="{{ custom-integrations-bots }}" data-fancybox="gallery" data-caption="Slack Custom Integrations Bots"><img src="{{ custom-integrations-bots }}" alt="Slack Custom Integrations Bots" class="img-fluid img-thumbnail"></a>   

2\. Choose a name and add the bot integration.
{% capture add-bot %}{% asset_path add-bot.png %}{% endcapture %}<a href="{{ add-bot }}" data-fancybox="gallery" data-caption="Add bot"><img src="{{ add-bot }}" alt="Add bot" class="img-fluid img-thumbnail"></a>   

3\. Save the **API Token**, we will use it later in Slack API requests for authentication.
{% capture api-token %}{% asset_path api-token.png %}{% endcapture %}<a href="{{ api-token }}" data-fancybox="gallery" data-caption="API token"><img src="{{ api-token }}" alt="API token" class="img-fluid img-thumbnail"></a>   

4\. Let's try out the [users.list][users-list] method using an API client like Postman and click on ***code*** to generate code:
{% capture list-users %}{% asset_path list-users.png %}{% endcapture %}<a href="{{ list-users }}" data-fancybox="gallery" data-caption="List Users API Request"><img src="{{ list-users }}" alt="List Users" class="img-fluid img-thumbnail"></a>   

```Python
# slack-api.py
import requests, json

base_url = "https://slack.com/api"

payload={}
headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer [your Slack Bot API Token]'
}

# Make GET request and receive response
response = requests.request("GET", f"{base_url}/users.list", headers=headers, data=payload)

# Convert response to a Dict object
response_json = json.loads(response.text)

# Find user by username
username = 'yueh.liu'
user = next((member for member in response_json['members'] if member['name'] == username), None)

# Make sure the user exists
if not user:
    raise Exception(f'User [{username}] was not found')

# Save the user_id
user_id = user['id']
```

5\. Now that we have the **User ID**, we can try sending a message to that user! We can repeat the previous step with the [chat.postMessage][post-message] method. Make sure to change the request method to `POST`.
{% capture send-message %}{% asset_path send-message.png %}{% endcapture %}<a href="{{ send-message }}" data-fancybox="gallery" data-caption="Send message to user"><img src="{{ send-message }}" alt="Send message to user" class="img-fluid img-thumbnail"></a>

You should receive a message like this on Slack   
{% capture ua-bot %}{% asset_path ua-bot.png %}{% endcapture %}<a href="{{ ua-bot }}" data-fancybox="gallery" data-caption="Message from ua-bot"><img src="{{ ua-bot }}" alt="ua-bot" class="img-fluid img-thumbnail"></a>  

The updated code should look something like this:

```Python
# slack-api.py
import requests, json

base_url = "https://slack.com/api"

payload={}
headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer [your Slack Bot API Token]'
}

# Make GET request and receive response
response = requests.request("GET", f"{base_url}/users.list", headers=headers, data=payload)

# Convert response to a Dict object
response_json = json.loads(response.text)

# Find user by username
username = 'yueh.liu'
user = next((member for member in response_json['members'] if member['name'] == username), None)

# Make sure the user exists
if not user:
    raise Exception(f'User [{username}] was not found')

# Save the user_id
user_id = user['id']

# Set the parameters such as the channel ID (user ID in our case), username for the bot, text message, icon url, etc
# You can also send a JSON payload instead of query parameters, but you would need to change the 'Content-Type' to 'application/json' in the headers
params = f"channel={user_id}&text=Hello Yueh!&username=ua-bot&icon_url=https://some-url-link.jpg"

# Make POST request and receive response
response = requests.request("POST", f"{base_url}/chat.postMessage?{params}", headers=headers, data=payload)

print(response.text)
```

### Using Slack Incoming Webhooks
> Incoming Webhooks are a simple way to post messages from external sources into Slack. They make use of normal HTTP requests with a JSON payload, which includes the message and a few other optional details described later.

For this example, we are going to create a Web Server and integrate an Incoming Webhook. We will trigger the webhook automatically to send a message to a user on Slack whenever the server receives a message.

1\. Navigate to the Custom Integrations page of your Workspace `https://<your-workspace-name>.slack.com/apps/manage/custom-integrations` and select ***Incoming WebHooks***
{% capture custom-integrations-webhooks %}{% asset_path custom-integrations-webhooks.png %}{% endcapture %}<a href="{{ custom-integrations-webhooks }}" data-fancybox="gallery" data-caption="Slack Custom Integrations Incoming Webhooks"><img src="{{ custom-integrations-webhooks }}" alt="Slack Custom Integrations Incoming Webhooks" class="img-fluid img-thumbnail"></a>

2\. Choose a channel (or user) to post your messages and add the webhook {% capture add-webhook %}{% asset_path add-webhook.png %}{% endcapture %}<a href="{{ add-webhook }}" data-fancybox="gallery" data-caption="Add an Incoming Webhook"><img src="{{ add-webhook }}" alt="add-webhook" class="img-fluid img-thumbnail"></a>    

You should see a message like this on Slack
{% capture added-integration %}{% asset_path added-integration.png %}{% endcapture %}<a href="{{ added-integration }}" data-fancybox="gallery" data-caption="Added Webhook Integration"><img src="{{ added-integration }}" alt="added-integration" class="img-fluid img-thumbnail"></a>

3\. Save the Webhook url {% capture webhook-url %}{% asset_path webhook-url.png %}{% endcapture %}<a href="{{ webhook-url }}" data-fancybox="gallery" data-caption="Slack Webhook url"><img src="{{ webhook-url }}" alt="webhook-url" class="img-fluid img-thumbnail"></a>

4\. Since webhooks work best as callback from a server, let's write a simple HTTP server that runs on localhost and port 3000. The web server will receive a message on `/message` path and read the message content from the payload.

```Python
# server.py
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

# Define a custom Request Handler
class CustomHandler(BaseHTTPRequestHandler):
    def set_response(self, code, byte_message):
        self.send_response(code)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(byte_message)

    def do_GET(self):
        if self.path == "/":
            self.set_response(200, "I'm alive!!!\n".encode())
            self.wfile.write()
        else:
            self.send_error(404)
        return

    def do_POST(self):
        if self.path == "/message":
            # Get payload
            content_length = int(self.headers["Content-Length"])
            encoded_data = self.rfile.read(content_length)
            data = json.loads(encoded_data.decode("utf-8"))

            if not "message" in data and not data['message']:
                self.send_error(400, "Bad Request", '"message" must be in the payload')
                return

            self.set_response(200, f"Received message: \"{data['message']}\"\n".encode())
        else:
            self.send_error(404)
        return

# Initialize an HTTP server
port = 3000
address = ("", port)
server = HTTPServer(address, CustomHandler)

# Start your server
print(f"Starting Web server on localhost:{port}..")
server.serve_forever()
```

5\. Check if server is running    
{% capture server-get %}{% asset_path server-get.png %}{% endcapture %}<a href="{{ server-get }}" data-fancybox="gallery" data-caption="Check local web server is alive"><img src="{{ server-get }}" alt="server-get" class="img-fluid img-thumbnail"></a>   

Let's try sending a message   
{% capture server-post %}{% asset_path server-post.png %}{% endcapture %}<a href="{{ server-post }}" data-fancybox="gallery" data-caption="Send message to local web server"><img src="{{ server-post }}" alt="server-post" class="img-fluid img-thumbnail"></a>

6\. Now that the server is running, let's integrate the webhook into the code!
```Python
# server.py
from http.server import BaseHTTPRequestHandler, HTTPServer
import json, requests

# Define a custom Request Handler
class CustomHandler(BaseHTTPRequestHandler):
    def set_response(self, code, byte_message):
        self.send_response(code)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(byte_message)

    def do_GET(self):
        if self.path == "/":
            self.set_response(200, "I'm alive!!!\n".encode())
            self.wfile.write()
        else:
            self.send_error(404)
        return

    def do_POST(self):
        if self.path == "/message":
            # Get payload
            content_length = int(self.headers["Content-Length"])
            encoded_data = self.rfile.read(content_length)
            data = json.loads(encoded_data.decode("utf-8"))

            if not "message" in data and not data['message']:
                self.send_error(400, "Bad Request", '"message" must be in the payload')
                return

            self.set_response(200, f"Received message: \"{data['message']}\"\n".encode())

            # Trigger the Webhook (make POST request) and we can ignore the response and failure
            try:
                webhook_url = "[Your Slack Webhook Url]"
                headers = { 'Content-Type': 'application/json' }
                payload = "{ \"text\": \"Your server received the following message:\n\n" + data['message'] + "\" }"
                requests.request("POST", webhook_url, headers=headers, data=payload)
            except Exception:
                pass
        else:
            self.send_error(404)
        return

# Initialize an HTTP server
port = 3000
address = ("", port)
server = HTTPServer(address, CustomHandler)

# Start your server
print(f"Starting Web server on localhost:{port}..")
server.serve_forever()
```

7\. Once updated, we can re-send the same message as earlier and you should receive a message like this on Slack:   
{% capture ua-webhook %}{% asset_path ua-webhook.png %}{% endcapture %}<a href="{{ ua-webhook }}" data-fancybox="gallery" data-caption="Message from ua-webhook"><img src="{{ ua-webhook }}" alt="ua-webhook" class="img-fluid img-thumbnail"></a>

## Conclusion
An API is a communication method used by applications to talk with other applications. Webhook is a POST request that is triggered automatically when an event happens. Basically, APIs are request-based while webhooks are event-based.


### References
* **[Webhook vs API][webhook-vs-api]**
* **[Comparing API Architectural Styles: SOAP vs REST vs GraphQL vs RPC][soap-vs-rest-vs-graphql-vs-rpc]**
* **[Slack Incoming Webhooks][slack-webhooks]**
* **[Slack User Bots][slack-bots]**
* **[Python Docs: HTTP servers][http-server]**
* **[Simple Python 3 HTTP server for logging all GET and POST requests][http-server-example]**

[webhook-vs-api]: https://sendgrid.com/blog/webhook-vs-api-whats-difference/
[soap-vs-rest-vs-graphql-vs-rpc]: https://www.altexsoft.com/blog/soap-vs-rest-vs-graphql-vs-rpc/
[slack-api-list]: https://api.slack.com/bot-users#api_methods_available_to_bots
[post-message]: https://api.slack.com/methods/chat.postMessage
[users-list]: https://api.slack.com/methods/users.list
[slack-webhooks]: https://api.slack.com/messaging/webhooks
[slack-bots]: https://api.slack.com/bot-users
[google-map-api]: https://developers.google.com/maps/documentation
[youtube-api]: https://developers.google.com/youtube/v3/getting-started
[http-server]: https://docs.python.org/3/library/http.server.html
[http-server-example]: https://gist.github.com/mdonkers/63e115cc0c79b4f6b8b3a6b797e485c7

<script src="//cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js"></script>
<script>
    hljs.initLineNumbersOnLoad();
    hljs.initHighlightLinesOnLoad([
        [{start: 8, end: 8, color: 'rgba(255, 255, 255, 0.2)'}],
        [{start: 28, end: 35, color: 'rgba(255, 255, 255, 0.2)'}],
        [],
        [{start: 2, end: 2, color: 'rgba(255, 255, 255, 0.2)'}, {start: 33, end: 40, color: 'rgba(255, 255, 255, 0.2)'}]
    ]);
</script>


🐢