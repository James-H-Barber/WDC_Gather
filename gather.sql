CREATE DATABASE gather;
USE gather;

CREATE TABLE users (
    userID INT NOT NULL AUTO_INCREMENT,
    password VARCHAR(255),
    email VARCHAR(255),
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    PRIMARY KEY (userID),
    UNIQUE KEY unique_email (email)
);

CREATE TABLE admins (
    userID INT,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    PRIMARY KEY (userID)
);

CREATE TABLE events (
    eventID INT NOT NULL AUTO_INCREMENT,
    eventName VARCHAR(255),
    eventStartTime DATETIME,
    eventEndTime DATETIME,
    eventOwner INT,
    eventLocation VARCHAR(255),
    FOREIGN KEY (eventOwner) REFERENCES users(userID) ON DELETE NO ACTION,
    PRIMARY KEY (eventID)
);

CREATE TABLE invited (
    linkKey INT NOT NULL,
    eventID INT,
    email VARCHAR(255),
    PRIMARY KEY(linkKey),
    FOREIGN KEY (eventID) REFERENCES events(eventID) ON DELETE CASCADE,
    UNIQUE KEY unique_email (email)
);

CREATE TABLE attending (
    arbitraryID INT NOT NULL AUTO_INCREMENT,
    eventID INT,
    userID INT,
    linkKey INT,
    PRIMARY KEY (arbitraryID),
    FOREIGN KEY (eventID) REFERENCES events(eventID) ON DELETE CASCADE,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (linkKey) REFERENCES invited(linkKey) ON DELETE CASCADE
);

CREATE TABLE available (
    userID INT,
    weekDays JSON,
    linkKey INT,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    UNIQUE KEY unique_id (userID)
);

INSERT INTO users (password, email, firstName, lastName) VALUES (SHA2("qwertyuiop", 224), "admin@gather.com", "Supreme", "Leader");
SELECT @adminID := userID FROM users WHERE email = "admin@gather.com";
INSERT INTO admins (userID) VALUES (@adminID);

-- Check if works:
-- SELECT users.firstName, users.lastName FROM users INNER JOIN admins ON users.userID = admins.userID;