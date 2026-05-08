/**
 * Daily Bible Word Search puzzles.
 * 30 themed sets — each has a title and exactly 12 uppercase words.
 * Puzzle index = (dayOfYear % puzzles.length).
 */

export interface WordSearchPuzzle {
  title: string;
  theme: string;
  words: string[]; // 12 words, ALL CAPS, max 10 chars recommended for 12×12 grid
}

export const wordSearchPuzzles: WordSearchPuzzle[] = [
  {
    title: "The Life of Jesus",
    theme: "Gospel",
    words: ["JESUS", "NAZARETH", "BETHLEHEM", "GALILEE", "BAPTISM", "MIRACLE", "DISCIPLE", "CROSS", "RISEN", "SAVIOR", "GOSPEL", "GRACE"],
  },
  {
    title: "In the Beginning",
    theme: "Creation",
    words: ["CREATION", "HEAVEN", "EARTH", "LIGHT", "DARKNESS", "WATERS", "GARDEN", "SERPENT", "FORBIDDEN", "ADAM", "EVE", "SPIRIT"],
  },
  {
    title: "The Psalms",
    theme: "Praise",
    words: ["PRAISE", "WORSHIP", "SHEPHERD", "PSALM", "HARP", "REJOICE", "MERCY", "STRENGTH", "REFUGE", "RESTORE", "TRUST", "GLORY"],
  },
  {
    title: "The Exodus",
    theme: "Freedom",
    words: ["MOSES", "PHARAOH", "PLAGUES", "PASSOVER", "EXODUS", "MANNA", "DESERT", "TABLETS", "COVENANT", "JORDAN", "FREEDOM", "PILLAR"],
  },
  {
    title: "The Apostles",
    theme: "Church",
    words: ["PETER", "ANDREW", "JOHN", "JAMES", "MATTHEW", "THOMAS", "PHILIP", "SIMON", "PAUL", "BARNABAS", "TIMOTHY", "TITUS"],
  },
  {
    title: "Fruits of the Spirit",
    theme: "Character",
    words: ["LOVE", "JOY", "PEACE", "PATIENCE", "KINDNESS", "GOODNESS", "FAITH", "GENTLE", "SPIRIT", "VIRTUE", "FRUIT", "WALK"],
  },
  {
    title: "The Armor of God",
    theme: "Ephesians",
    words: ["ARMOR", "TRUTH", "PEACE", "FAITH", "SHIELD", "HELMET", "SWORD", "PRAYER", "SPIRIT", "STAND", "EVIL", "BELT"],
  },
  {
    title: "Kings of Israel",
    theme: "Royalty",
    words: ["SAUL", "DAVID", "SOLOMON", "REHOBOAM", "JEHOSHAPHAT", "HEZEKIAH", "JOSIAH", "ANOINTED", "THRONE", "CROWN", "TEMPLE", "ISRAEL"],
  },
  {
    title: "Women of Faith",
    theme: "Heroines",
    words: ["MARY", "RUTH", "ESTHER", "DEBORAH", "SARAH", "RACHEL", "HANNAH", "MIRIAM", "PRISCILLA", "LYDIA", "NAOMI", "FAITH"],
  },
  {
    title: "The Beatitudes",
    theme: "Sermon",
    words: ["BLESSED", "POOR", "MOURN", "MEEK", "MERCIFUL", "PURE", "PEACEMAKER", "HUNGER", "THIRST", "RIGHTEOUS", "KINGDOM", "HEAVEN"],
  },
  {
    title: "The Lord's Prayer",
    theme: "Prayer",
    words: ["FATHER", "HEAVEN", "HALLOWED", "KINGDOM", "WILL", "DAILY", "BREAD", "FORGIVE", "TEMPTATION", "DELIVER", "POWER", "FOREVER"],
  },
  {
    title: "Miracles of Jesus",
    theme: "Signs",
    words: ["WATER", "WINE", "HEALING", "LOAVES", "FISHES", "LAZARUS", "BLIND", "LEPER", "WALKING", "STORM", "RAISED", "MIRACLE"],
  },
  {
    title: "The Prophets",
    theme: "Prophecy",
    words: ["ISAIAH", "JEREMIAH", "EZEKIEL", "DANIEL", "HOSEA", "AMOS", "JONAH", "MICAH", "NAHUM", "HABAKKUK", "VISION", "ORACLE"],
  },
  {
    title: "The Tabernacle",
    theme: "Worship",
    words: ["TABERNACLE", "ALTAR", "PRIEST", "INCENSE", "LAMPSTAND", "CURTAIN", "MERCY", "SACRIFICE", "ATONEMENT", "HOLY", "ARK", "LINEN"],
  },
  {
    title: "The Parables",
    theme: "Teaching",
    words: ["PRODIGAL", "SOWER", "MUSTARD", "TALENT", "PEARL", "VINEYARD", "SHEPHERD", "WEDDING", "SERVANT", "LAMP", "SEED", "PARABLE"],
  },
  {
    title: "Names of God",
    theme: "Attributes",
    words: ["YAHWEH", "ELOHIM", "ADONAI", "JEHOVAH", "SHADDAI", "RAPHA", "JIREH", "NISSI", "SHALOM", "TSIDKENU", "SHEPHERD", "HOLY"],
  },
  {
    title: "The Birth of Jesus",
    theme: "Christmas",
    words: ["BETHLEHEM", "MANGER", "ANGEL", "SHEPHERD", "MAGI", "STAR", "JOSEPH", "MARY", "SWADDLING", "HEAVEN", "GLORY", "SAVIOR"],
  },
  {
    title: "The Resurrection",
    theme: "Easter",
    words: ["RISEN", "TOMB", "ANGEL", "LINEN", "MARY", "PETER", "DISCIPLES", "APPEAR", "GALILEE", "ASCEND", "ALIVE", "VICTORY"],
  },
  {
    title: "The Book of Proverbs",
    theme: "Wisdom",
    words: ["WISDOM", "FOLLY", "PROVERB", "HEART", "COUNSEL", "UNDERSTANDING", "RIGHTEOUS", "WICKED", "HONOR", "HUMBLE", "PRIDE", "TRUST"],
  },
  {
    title: "Faith Heroes",
    theme: "Hebrews 11",
    words: ["ABEL", "ENOCH", "NOAH", "ABRAHAM", "SARAH", "ISAAC", "JACOB", "MOSES", "RAHAB", "GIDEON", "SAMSON", "FAITH"],
  },
  {
    title: "The Ten Commandments",
    theme: "Law",
    words: ["COMMANDMENT", "IDOL", "SABBATH", "HONOR", "MURDER", "ADULTERY", "STEAL", "FALSE", "COVET", "GOD", "SINAI", "STONE"],
  },
  {
    title: "The Beatitudes",
    theme: "Matthew 5",
    words: ["BLESSED", "MEEK", "MERCIFUL", "PURE", "PEACE", "MOURN", "RIGHTEOUS", "POOR", "SPIRIT", "COMFORT", "EARTH", "LIGHT"],
  },
  {
    title: "Heaven and Angels",
    theme: "Celestial",
    words: ["ANGEL", "SERAPH", "CHERUB", "THRONE", "WORSHIP", "CROWN", "TRUMPET", "GLORY", "JASPER", "CRYSTAL", "RIVER", "ETERNAL"],
  },
  {
    title: "Paul's Letters",
    theme: "Epistles",
    words: ["ROMANS", "CORINTH", "GALATIANS", "EPHESIANS", "PHILIPPIANS", "COLOSSIANS", "TIMOTHY", "TITUS", "PHILEMON", "GRACE", "FAITH", "LOVE"],
  },
  {
    title: "The Holy Spirit",
    theme: "Pentecost",
    words: ["SPIRIT", "DOVE", "FIRE", "WIND", "TONGUES", "GIFTS", "COMFORT", "GUIDE", "TRUTH", "HELPER", "POWER", "ANOINTED"],
  },
  {
    title: "The Sermon on the Mount",
    theme: "Mountain",
    words: ["SALT", "LIGHT", "MOUNTAIN", "BLESSED", "ANGER", "ADULTERY", "OATH", "ENEMY", "PRAYER", "FASTING", "TREASURE", "JUDGE"],
  },
  {
    title: "The Lord is My Shepherd",
    theme: "Psalm 23",
    words: ["SHEPHERD", "PASTURE", "WATER", "RESTORE", "VALLEY", "SHADOW", "EVIL", "ROD", "STAFF", "TABLE", "ANOINTED", "MERCY"],
  },
  {
    title: "The Book of Revelation",
    theme: "Prophecy",
    words: ["REVELATION", "LAMB", "BEAST", "SEAL", "TRUMPET", "DRAGON", "BABYLON", "CROWN", "THRONE", "ALPHA", "OMEGA", "VICTORY"],
  },
  {
    title: "Love Chapter",
    theme: "1 Corinthians 13",
    words: ["LOVE", "PATIENT", "KIND", "ENVY", "BOAST", "PROUD", "RUDE", "TRUTH", "FAITH", "HOPE", "ENDURE", "PERFECT"],
  },
  {
    title: "The Transfiguration",
    theme: "Glory",
    words: ["JESUS", "MOSES", "ELIJAH", "PETER", "JOHN", "JAMES", "CLOUD", "VOICE", "GLORY", "MOUNTAIN", "WHITE", "SHINING"],
  },
];
