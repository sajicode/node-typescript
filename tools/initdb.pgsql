DROP TABLE IF EXISTS games;

CREATE TABLE IF NOT EXISTS games (
  id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
  , user_id varchar(50) NOT NULL
  , title varchar(50) NOT NULL
  , genre varchar(50) NOT NULL
  , year smallint NULL
  , company varchar(50) NULL
);