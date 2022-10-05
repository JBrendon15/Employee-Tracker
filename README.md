# Employee-Tracker

## Description
For this project, we had to use inquirer to present questions to a user for them to select an option. Based on their selection, a specific function will run to do what they selected. We used MySql queries to get information from our database. We used SELECT, JOIN, and UPDATE queries to achieve what we wanted to do. We used console.table to display the tables that we get from our MySql databases in the console in a cleaner format. We also used mysql2 to run queries based on user inputs.

## Installation
  
Right click the 'package.json' file and click 'Open in Integrated Terminal' then type the following in your terminal to install the neccessary packages:
```
npm i
```
Right click 'schema.sql' file and click 'Open in Integrated Terminal' then type the following in the terminal to turn on mysql server:
```
mysql -u root -p
```
Enter your MySql password when prompted then run the following codes to seed dummy data into your MySql database: 
```
source schema.sql;
source seeds.sql;
```
Go into the server.js file and change line 18, "password:" to your MySql password in a string.

## Usage
Right click the 'server.js' file and click 'Open in integrated terminal
```
npm start
```
[Tutorial Video](https://www.awesomescreenshot.com/video/11513798?key=f3443fd22cb6f7034601c1a27b4d8418)