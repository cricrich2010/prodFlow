use prodFlow;

DROP TABLE IF EXISTS Incidents ;
DROP TABLE IF EXISTS TeamsPeople ;
DROP TABLE IF EXISTS Teams ;
DROP TABLE IF EXISTS People ;
DROP TABLE IF EXISTS Incidents ;
DROP TABLE IF EXISTS ProdLignes;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS Sites;

CREATE TABLE Sites (
Site varchar(32) not null ,
PRIMARY KEY (Site));
    
    
CREATE TABLE addresses (
Site varchar(32),
Country varchar(32),
City varchar(32),
Street varchar(64),
Number int);

ALTER TABLE addresses ADD CONSTRAINT FK_Adresses_Site FOREIGN KEY (Site) REFERENCES Sites (Site) ON DELETE CASCADE;

CREATE TABLE ProdLignes (
NoLigne VARCHAR(16) NOT NULL,
Volume BIGINT NOT NULL,
Site varchar(32) NOT NULL,
PRIMARY KEY (NoLigne));

ALTER TABLE ProdLignes ADD CONSTRAINT FK_ProdLignes_Site FOREIGN KEY (Site) REFERENCES Sites (Site) ON DELETE CASCADE;

CREATE TABLE People(
FirstName Varchar(32) NOT NULL,
Auth varchar(64),
PRIMARY KEY (FirstName));

CREATE TABLE Teams (
Team VARCHAR(32) NOT NULL,
PRIMARY KEY (Team));

CREATE TABLE TeamsPeople (
Team VARCHAR(32) NOT NULL,
FirstName VARCHAR(32) NOT NULL,
PRIMARY KEY (Team, FirstName));

ALTER TABLE TeamsPeople ADD CONSTRAINT FK_TeamsPeople_Team FOREIGN KEY (Team) REFERENCES Teams (Team);
ALTER TABLE TeamsPeople ADD CONSTRAINT FK_TeamsPeople_FirstName FOREIGN KEY (FirstName) REFERENCES People (FirstName);


Create TABLE Incidents (
NoInc BIGINT NOT NULL AUTO_INCREMENT,
Description Varchar(128),
NoLigne varchar(16),
Team VARCHAR(32),
Assignee VARCHAR(32),
PRIMARY KEY (NoInc));

ALTER TABLE Incidents ADD CONSTRAINT FK_Incidents_NoLigne FOREIGN KEY (NoLigne) REFERENCES ProdLignes (NoLigne);
ALTER TABLE Incidents ADD CONSTRAINT FK_Incidents_Team FOREIGN KEY (Team) REFERENCES Teams (Team);
ALTER TABLE Incidents ADD CONSTRAINT FK_Incidents_TeamsPeople FOREIGN KEY (Team, Assignee)  REFERENCES TeamsPeople (Team, FirstName);





    