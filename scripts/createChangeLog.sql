CREATE TABLE IF NOT EXISTS 'CHANGE_LOG' (
  'ID' VARCHAR (64) NOT NULL,
  'CHANGE_DATETIME' DATETIME NOT NULL,
  'CHANGE_OBJ' VARCHAR(255) NOT NULL,
  'CHANGE_VAL' TEXT NOT NULL,
  'APPLIED_DATETIME' DATETIME NOT NULL,
  PRIMARY KEY ('ID')
);
-- ENGINE=MyISAM  DEFAULT CHARSET=latin1 COMMENT='Table with abuse reports' AUTO_INCREMENT=1 ;