# HW 3 - Data Collection, Storage and Reporting

## Preparation - Checkpoint 1
1. [Install json-server](https://github.com/typicode/json-server) in ```/var/www/1deca.de/public_html/```
    > the **JSON** file should be called ```db.json```
    ```bash
    cd /var/www/1deca.de/public_html/
    sudo npm install json-server
    sudo nano db.json
    ```

    ```
    # db.json
    {
        "posts": [
            { "id": "1", "title": "Post by Tom", "views": 100, "author": "Tom" },
            { "id": "2", "title": "Post by Aiden", "views": 150, "author": "Aiden" },
            { "id": "3", "title": "Post by Xiaogeng", "views": 200, "author": "Xiaogeng" },
            { "id": "4", "title": "Post by Sam", "views": 250, "author": "Sam" }
        ],
        "comments": [
            { "id": "1", "text": "Comment about Tom's post", "postId": "1" },
            { "id": "2", "text": "Another comment about Tom's post", "postId": "1" },
            { "id": "3", "text": "Comment about Aiden's post", "postId": "2" },
            { "id": "4", "text": "Comment about Xiaogeng's post", "postId": "3" },
            { "id": "5", "text": "Comment about Sam's post", "postId": "4" }
        ],
        "profile": {
            "authors": ["Tom", "Aiden", "Xiaogeng", "Sam"]
        }
    }
    ```

    ```bash
    # run the server
    npx json-server db.json
    ```
    ```bash
    # Downgrade the json-server
    npm init -y
    npm install json-server@0.16.3 --save
    ```
2. Give write access to ```db.json```
    ```bash
    sudo chmod 666 db.json
    ```

3. Expose the server on an endpoint is **not** ```localhost```
    ```bash
    sudo ufw allow 3000 # port 3000 will be used
    sudo npm i pm2@latest -g # pm2: run node apps in the background, so you can run them not logged into your server
    ```

4. Create a ```server.js```

    - [warapitiya's simple json-server code](https://github.com/typicode/json-server/issues/253)

    - since my ```node_moduals``` is on ```/var/www/node_modules```, so I might need to create a soft link:
        ``` bash
        sudo ln -s /var/www/node_modules node_modules
        ```

5. Run the server
    ```bash
    pm2 start server.js
    ```

6. Test
    - The server will run on [```1deca.de:3000```](https://1deca.de:3000)
    - Make a simple ```GET``` request to ```1deca.de:3000/posts```
        - Get a small JSON packet in return

7. Create a proxy route for the server
    - enable proxy function
        ```bash
        sudo a2enmod proxy
        sudo a2enmod proxy_http
        cd /etc/apache2/sites-available
        sudo vim 1deca.de-le-ssl.conf
        ```

    - Add content to the configuration
        ```bash
        ProxyPreserveHost On
        ProxyPass /json http://localhost:3000
        ProxyPassReverse /json http://localhost:3000
        ```

    - Restart server
        ```bash
        sudo systemctl restart apache2
        ```
8. Test 2
    - The new URL for the server: [1deca.de/json](https://1deca.de/json)
    - GET request
    - POST
    - DELETE

9. Remove the rules that open port 3000
    ```bash
    sudo ufw status
    sudo ufw delete [number]
    ```

10. Download & install & test [Postman](https://www.postman.com/downloads/)

11. Learn more with [JSON server doc](https://github.com/typicode/json-server#routes)

## Data Collection 
### Collecting and Sending Analytical Data - Checkpoint 1
> 1. Collecting the data from users
#### Basic Flow
User enters at site homepage -> The homepage loads the collector script -> Collector script gathers data and sends it to your endpoint -> Data is sent to DB to be stored -> Data displayed in for raw consumption
        or -> Data displayed in charts for analytical consumption
     
#### collector.js
##### Function & Requirement
- [ ] Three Types of Data
    - [ ] 1. **Static** (collected after the page has loaded)
        - [x] user **agent string**
            - [UA string](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Browser_detection_using_the_user_agent)
            - [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers)
            - [User-Agent Client Hints API](https://developer.mozilla.org/en-US/docs/Web/API/User-Agent_Client_Hints_API)
        - [x] the user's **language**
        - [x] if the user accepts **cookies**
            - Do we need to get cookies?
        - [ ] if the user allows **JavaScript**
        - [ ] if the user allows **images**
        - [ ] if the user allows **CSS**
        - [ ] user's **screen dimensions**
        - [ ] user's **window dimensions**
        - [ ] user's **network connection type**
    - [ ] 2. **Performance** (collected after the page has loaded)
        - [ ] The **timing** of the page **load**
            - [ ] The whole timing object
            - [ ] Specifically when the page started loading
            - [ ] Specifically when the page ended loading
            - [ ] The total load time, in millisecond
    - [ ] 3. **Activity** (continuously collected)
        - [ ] All thrown errors
            - window.onerror
            - various reporting scripts
        - [ ] [All mouse activity](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event)
            - [ ] Cursor positions (coordinates)
            - [ ] Clicks (and which mouse button it was)
            - [ ] Scrolling (coordinates of the scroll)
        - [ ] [All keyboard activity](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event)
            - [ ] Key down or key up events
        - [ ] Any idle time where no activity happened for a period of 2 or more seconds
            - [ ] Record when the break ended
            - [ ] Record how long it lasted, in milliseconds
        - [ ] When the user entered the page
        - [ ] When the user left the page
        - [ ] Which page the user was on
- [ ] Tie the data to a specific user session
- [ ] Save the data locally, then make attempts to send updates to the server
    - [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
    - [sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
    - [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)



## Storage
2. Creating a database to store this data
3. Creating a REST endpoint to access/manage this data (interface of database)

## Reporting