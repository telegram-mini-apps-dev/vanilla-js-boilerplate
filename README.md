<p align="center">
  <br>
  <img width="240" src="./assets/img/tapps.png" alt="logo of telegram web apps">
  <br>
  <br>
</p>

# Telegram Mini Apps Basic Example With BackEnd
This is a basic and straightforward Telegram Mini App(TMA) implemented using plain JavaScript, HTML, CSS and PHP. This project aims to provide a minimalistic example of how to create a simple TMA with back-end and launch it within Telegram without relying on complex build tools or bleeding-edge libraries.

## Features

- **Validation of initData**: Ensures that the initData sent by the Telegram MiniApp is valid by checking the HMAC hash and database for registered users.
- **Modal Alerts and Confirmations**: Displays different types of modals such as alerts, confirmations, and popups.
- **Link Management**: Opens links either within Telegram or in an external browser.
- **Dynamic UI Elements**: Adjusts the UI based on Telegram's webview properties like viewport size and expansion.
- **Eruda Integration**: Includes Eruda for mobile debugging.
- Minimalistic user interface.
- No external libraries or frameworks used.
- Easy to understand and modify.

## Project Structure

- **/api/api.php**: Handles the server-side validation of initData from the Telegram MiniApp.
- **/assets/js/main.js**: Initializes and interacts with Telegram MiniApp features.
- **index.html**: Contains the front-end structure with basic interaction capabilities.

### Prerequisites

- A Telegram bot token with access to the MiniApp.
- A MySQL database for storing user information.

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/h0z3yn/basic-telegram-mini-app.git

2. Navigate to the project directory:

	```bash
	cd basic-telegram-mini-app

3. Set up your database by creating a table for storing Telegram user data:

	```sql
	CREATE TABLE `users` ( `telegramChatId` BIGINT NOT NULL PRIMARY KEY );

4. Edit `/api/api.php` to include your bot token and database credentials:

5. Serve the project on a local or remote server (e.g., using Apache, Nginx, or PHP's built-in server):

	```bash
	php -S localhost:8000

### Usage
1. Open `index.html` and `/api/api.php` and `/assets/js/main.js` in your preferred code editor or IDE.
2. Make your changes
3. Integrate this app with your Telegram bot by adding the MiniApp URL (e.g., `https://yourserver.com/index.html`) to your bot's settings.
4. When users open the MiniApp through Telegram, their data will be validated, and appropriate content will be displayed based on the validation result.

### Customization
Feel free to customize this web app to suit your needs. You can modify the PHP, HTML, CSS, and JavaScript files as required.

## Contributing
If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your branch to your fork.
5. Create a pull request to the main repository's main branch.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
