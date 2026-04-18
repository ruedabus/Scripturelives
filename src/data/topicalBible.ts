export type TopicVerse = {
  reference: string;
  text: string;
};

export type Topic = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  verses: TopicVerse[];
};

export type TopicCategory = {
  category: string;
  topics: Topic[];
};

export const TOPICAL_BIBLE: TopicCategory[] = [
  {
    category: "Faith & Salvation",
    topics: [
      {
        id: "faith",
        title: "Faith",
        emoji: "✝️",
        description: "Trusting God even when we cannot see",
        verses: [
          { reference: "Hebrews 11:1", text: "Now faith is the substance of things hoped for, the evidence of things not seen." },
          { reference: "Romans 10:17", text: "So then faith cometh by hearing, and hearing by the word of God." },
          { reference: "Ephesians 2:8", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God." },
          { reference: "James 2:17", text: "Even so faith, if it hath not works, is dead, being alone." },
          { reference: "Mark 11:22", text: "And Jesus answering saith unto them, Have faith in God." },
          { reference: "Matthew 17:20", text: "If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove; and nothing shall be impossible unto you." },
          { reference: "Galatians 2:20", text: "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me." },
          { reference: "Hebrews 11:6", text: "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him." },
        ],
      },
      {
        id: "salvation",
        title: "Salvation",
        emoji: "🕊️",
        description: "God's gift of eternal life through Jesus Christ",
        verses: [
          { reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
          { reference: "Romans 10:9", text: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved." },
          { reference: "Acts 4:12", text: "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved." },
          { reference: "John 14:6", text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me." },
          { reference: "Romans 6:23", text: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord." },
          { reference: "Ephesians 2:8-9", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast." },
          { reference: "2 Corinthians 5:17", text: "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new." },
          { reference: "John 1:12", text: "But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name." },
        ],
      },
      {
        id: "grace",
        title: "Grace & Mercy",
        emoji: "🌿",
        description: "God's unmerited favor and compassion toward us",
        verses: [
          { reference: "Ephesians 2:4-5", text: "But God, who is rich in mercy, for his great love wherewith he loved us, Even when we were dead in sins, hath quickened us together with Christ, (by grace ye are saved)." },
          { reference: "2 Corinthians 12:9", text: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness." },
          { reference: "Hebrews 4:16", text: "Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need." },
          { reference: "Romans 5:8", text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us." },
          { reference: "Lamentations 3:22-23", text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness." },
          { reference: "Titus 2:11", text: "For the grace of God that bringeth salvation hath appeared to all men." },
          { reference: "Psalm 103:8", text: "The LORD is merciful and gracious, slow to anger, and plenteous in mercy." },
        ],
      },
      {
        id: "repentance",
        title: "Repentance",
        emoji: "🔄",
        description: "Turning away from sin and back to God",
        verses: [
          { reference: "1 John 1:9", text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness." },
          { reference: "Acts 3:19", text: "Repent ye therefore, and be converted, that your sins may be blotted out, when the times of refreshing shall come from the presence of the Lord." },
          { reference: "2 Chronicles 7:14", text: "If my people, which are called by my name, shall humble themselves, and pray, and seek my face, and turn from their wicked ways; then will I hear from heaven, and will forgive their sin, and will heal their land." },
          { reference: "Isaiah 1:18", text: "Come now, and let us reason together, saith the LORD: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool." },
          { reference: "Luke 15:10", text: "Likewise, I say unto you, there is joy in the presence of the angels of God over one sinner that repenteth." },
          { reference: "Ezekiel 18:30", text: "Therefore I will judge you, O house of Israel, every one according to his ways, saith the Lord GOD. Repent, and turn yourselves from all your transgressions; so iniquity shall not be your ruin." },
        ],
      },
    ],
  },
  {
    category: "Prayer & Worship",
    topics: [
      {
        id: "prayer",
        title: "Prayer",
        emoji: "🙏",
        description: "Communicating with God in all circumstances",
        verses: [
          { reference: "Philippians 4:6", text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God." },
          { reference: "Matthew 6:9-10", text: "After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name. Thy kingdom come, Thy will be done in earth, as it is in heaven." },
          { reference: "1 Thessalonians 5:17", text: "Pray without ceasing." },
          { reference: "James 5:16", text: "Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much." },
          { reference: "Matthew 7:7", text: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you." },
          { reference: "John 15:7", text: "If ye abide in me, and my words abide in you, ye shall ask what ye will, and it shall be done unto you." },
          { reference: "Romans 8:26", text: "Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered." },
          { reference: "Psalm 46:10", text: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth." },
        ],
      },
      {
        id: "worship",
        title: "Praise & Worship",
        emoji: "🎵",
        description: "Honoring God with our hearts, voices, and lives",
        verses: [
          { reference: "Psalm 100:4", text: "Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name." },
          { reference: "John 4:24", text: "God is a Spirit: and they that worship him must worship him in spirit and in truth." },
          { reference: "Psalm 150:6", text: "Let every thing that hath breath praise the LORD. Praise ye the LORD." },
          { reference: "Romans 12:1", text: "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service." },
          { reference: "Psalm 34:1", text: "I will bless the LORD at all times: his praise shall continually be in my mouth." },
          { reference: "Hebrews 13:15", text: "By him therefore let us offer the sacrifice of praise to God continually, that is, the fruit of our lips giving thanks to his name." },
          { reference: "Psalm 95:6", text: "O come, let us worship and bow down: let us kneel before the LORD our maker." },
        ],
      },
      {
        id: "gods_word",
        title: "God's Word",
        emoji: "📖",
        description: "The power and truth of Scripture in our lives",
        verses: [
          { reference: "2 Timothy 3:16-17", text: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: That the man of God may be perfect, throughly furnished unto all good works." },
          { reference: "Hebrews 4:12", text: "For the word of God is quick, and powerful, and sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart." },
          { reference: "Psalm 119:105", text: "Thy word is a lamp unto my feet, and a light unto my path." },
          { reference: "Isaiah 40:8", text: "The grass withereth, the flower fadeth: but the word of our God shall stand for ever." },
          { reference: "Matthew 4:4", text: "But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God." },
          { reference: "Joshua 1:8", text: "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night, that thou mayest observe to do according to all that is written therein." },
          { reference: "Psalm 119:11", text: "Thy word have I hid in mine heart, that I might not sin against thee." },
        ],
      },
    ],
  },
  {
    category: "Emotions & Inner Life",
    topics: [
      {
        id: "anxiety",
        title: "Anxiety & Fear",
        emoji: "🕊️",
        description: "Finding peace in God when worry overwhelms",
        verses: [
          { reference: "Philippians 4:6-7", text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
          { reference: "Isaiah 41:10", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness." },
          { reference: "Psalm 23:4", text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
          { reference: "1 Peter 5:7", text: "Casting all your care upon him; for he careth for you." },
          { reference: "2 Timothy 1:7", text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind." },
          { reference: "John 14:27", text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid." },
          { reference: "Matthew 6:34", text: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof." },
          { reference: "Psalm 34:4", text: "I sought the LORD, and he heard me, and delivered me from all my fears." },
        ],
      },
      {
        id: "strength",
        title: "Strength & Courage",
        emoji: "💪",
        description: "God's power working through our weakness",
        verses: [
          { reference: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
          { reference: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },
          { reference: "Joshua 1:9", text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest." },
          { reference: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble." },
          { reference: "2 Corinthians 12:10", text: "Therefore I take pleasure in infirmities, in reproaches, in necessities, in persecutions, in distresses for Christ's sake: for when I am weak, then am I strong." },
          { reference: "Nehemiah 8:10", text: "Neither be ye sorry; for the joy of the LORD is your strength." },
          { reference: "Ephesians 6:10", text: "Finally, my brethren, be strong in the Lord, and in the power of his might." },
          { reference: "Psalm 27:1", text: "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?" },
        ],
      },
      {
        id: "hope",
        title: "Hope",
        emoji: "🌅",
        description: "Confident expectation in God's promises",
        verses: [
          { reference: "Romans 15:13", text: "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost." },
          { reference: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
          { reference: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
          { reference: "Lamentations 3:22-23", text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness." },
          { reference: "Psalm 31:24", text: "Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD." },
          { reference: "Hebrews 6:19", text: "Which hope we have as an anchor of the soul, both sure and stedfast, and which entereth into that within the veil." },
          { reference: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles." },
        ],
      },
      {
        id: "grief",
        title: "Grief & Comfort",
        emoji: "💙",
        description: "God's comfort in times of sorrow and loss",
        verses: [
          { reference: "Psalm 34:18", text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit." },
          { reference: "Matthew 5:4", text: "Blessed are they that mourn: for they shall be comforted." },
          { reference: "2 Corinthians 1:3-4", text: "Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort; Who comforteth us in all our tribulation, that we may be able to comfort them which are in any trouble." },
          { reference: "Psalm 147:3", text: "He healeth the broken in heart, and bindeth up their wounds." },
          { reference: "Isaiah 41:10", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee." },
          { reference: "John 11:35", text: "Jesus wept." },
          { reference: "Revelation 21:4", text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away." },
        ],
      },
      {
        id: "joy",
        title: "Joy",
        emoji: "😊",
        description: "The deep gladness that comes from knowing God",
        verses: [
          { reference: "Psalm 16:11", text: "Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore." },
          { reference: "Nehemiah 8:10", text: "Neither be ye sorry; for the joy of the LORD is your strength." },
          { reference: "John 15:11", text: "These things have I spoken unto you, that my joy might remain in you, and that your joy might be full." },
          { reference: "Romans 15:13", text: "Now the God of hope fill you with all joy and peace in believing." },
          { reference: "Psalm 30:5", text: "Weeping may endure for a night, but joy cometh in the morning." },
          { reference: "Galatians 5:22", text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith." },
          { reference: "James 1:2", text: "My brethren, count it all joy when ye fall into divers temptations." },
          { reference: "Philippians 4:4", text: "Rejoice in the Lord alway: and again I say, Rejoice." },
        ],
      },
    ],
  },
  {
    category: "Relationships",
    topics: [
      {
        id: "love",
        title: "Love",
        emoji: "❤️",
        description: "God's love for us and our love for others",
        verses: [
          { reference: "1 Corinthians 13:4-7", text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things." },
          { reference: "John 13:34", text: "A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another." },
          { reference: "1 John 4:8", text: "He that loveth not knoweth not God; for God is love." },
          { reference: "Romans 8:38-39", text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." },
          { reference: "1 John 4:19", text: "We love him, because he first loved us." },
          { reference: "John 15:13", text: "Greater love hath no man than this, that a man lay down his life for his friends." },
          { reference: "Matthew 22:37-39", text: "Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself." },
        ],
      },
      {
        id: "forgiveness",
        title: "Forgiveness",
        emoji: "🤝",
        description: "Releasing others and receiving God's pardon",
        verses: [
          { reference: "Ephesians 4:32", text: "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you." },
          { reference: "Colossians 3:13", text: "Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye." },
          { reference: "Matthew 6:14", text: "For if ye forgive men their trespasses, your heavenly Father will also forgive you." },
          { reference: "1 John 1:9", text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness." },
          { reference: "Psalm 103:12", text: "As far as the east is from the west, so far hath he removed our transgressions from us." },
          { reference: "Isaiah 43:25", text: "I, even I, am he that blotteth out thy transgressions for mine own sake, and will not remember thy sins." },
          { reference: "Luke 6:37", text: "Judge not, and ye shall not be judged: condemn not, and ye shall not be condemned: forgive, and ye shall be forgiven." },
        ],
      },
      {
        id: "marriage",
        title: "Marriage & Family",
        emoji: "👨‍👩‍👧",
        description: "God's design for family and covenant relationships",
        verses: [
          { reference: "Genesis 2:24", text: "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh." },
          { reference: "Ephesians 5:25", text: "Husbands, love your wives, even as Christ also loved the church, and gave himself for it." },
          { reference: "Proverbs 31:10", text: "Who can find a virtuous woman? for her price is far above rubies." },
          { reference: "Proverbs 22:6", text: "Train up a child in the way he should go: and when he is old, he will not depart from it." },
          { reference: "Psalm 127:3", text: "Lo, children are an heritage of the LORD: and the fruit of the womb is his reward." },
          { reference: "Colossians 3:18-19", text: "Wives, submit yourselves unto your own husbands, as it is fit in the Lord. Husbands, love your wives, and be not bitter against them." },
          { reference: "Joshua 24:15", text: "But as for me and my house, we will serve the LORD." },
        ],
      },
      {
        id: "friendship",
        title: "Friendship & Community",
        emoji: "👥",
        description: "Iron sharpening iron — the gift of godly relationships",
        verses: [
          { reference: "Proverbs 27:17", text: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend." },
          { reference: "Ecclesiastes 4:9-10", text: "Two are better than one; because they have a good reward for their labour. For if they fall, the one will lift up his fellow: but woe to him that is alone when he falleth; for he hath not another to help him up." },
          { reference: "Hebrews 10:24-25", text: "And let us consider one another to provoke unto love and to good works: Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another." },
          { reference: "John 15:13", text: "Greater love hath no man than this, that a man lay down his life for his friends." },
          { reference: "Proverbs 18:24", text: "A man that hath friends must shew himself friendly: and there is a friend that sticketh closer than a brother." },
          { reference: "Romans 12:10", text: "Be kindly affectioned one to another with brotherly love; in honour preferring one another." },
        ],
      },
    ],
  },
  {
    category: "Character & Wisdom",
    topics: [
      {
        id: "wisdom",
        title: "Wisdom",
        emoji: "💡",
        description: "Seeking God's insight and understanding",
        verses: [
          { reference: "James 1:5", text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him." },
          { reference: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
          { reference: "Proverbs 9:10", text: "The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding." },
          { reference: "Colossians 2:3", text: "In whom are hid all the treasures of wisdom and knowledge." },
          { reference: "Ecclesiastes 12:13", text: "Let us hear the conclusion of the whole matter: Fear God, and keep his commandments: for this is the whole duty of man." },
          { reference: "Proverbs 4:7", text: "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding." },
          { reference: "Romans 11:33", text: "O the depth of the riches both of the wisdom and knowledge of God! how unsearchable are his judgments, and his ways past finding out!" },
        ],
      },
      {
        id: "humility",
        title: "Humility",
        emoji: "🙇",
        description: "Putting God and others before ourselves",
        verses: [
          { reference: "Philippians 2:3-4", text: "Let nothing be done through strife or vainglory; but in lowliness of mind let each esteem other better than themselves. Look not every man on his own things, but every man also on the things of others." },
          { reference: "James 4:10", text: "Humble yourselves in the sight of the Lord, and he shall lift you up." },
          { reference: "1 Peter 5:6", text: "Humble yourselves therefore under the mighty hand of God, that he may exalt you in due time." },
          { reference: "Matthew 23:12", text: "And whosoever shall exalt himself shall be abased; and he that shall humble himself shall be exalted." },
          { reference: "Proverbs 11:2", text: "When pride cometh, then cometh shame: but with the lowly is wisdom." },
          { reference: "Micah 6:8", text: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?" },
        ],
      },
      {
        id: "patience",
        title: "Patience & Perseverance",
        emoji: "⏳",
        description: "Enduring with faith through seasons of waiting",
        verses: [
          { reference: "Romans 5:3-4", text: "And not only so, but we glory in tribulations also: knowing that tribulation worketh patience; And patience, experience; and experience, hope." },
          { reference: "James 1:3-4", text: "Knowing this, that the trying of your faith worketh patience. But let patience have her perfect work, that ye may be perfect and entire, wanting nothing." },
          { reference: "Hebrews 12:1", text: "Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us." },
          { reference: "Galatians 6:9", text: "And let us not be weary in well doing: for in due season we shall reap, if we faint not." },
          { reference: "Psalm 27:14", text: "Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD." },
          { reference: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary." },
        ],
      },
      {
        id: "obedience",
        title: "Obedience",
        emoji: "🛐",
        description: "Walking in God's commands out of love and reverence",
        verses: [
          { reference: "John 14:15", text: "If ye love me, keep my commandments." },
          { reference: "Deuteronomy 28:1", text: "And it shall come to pass, if thou shalt hearken diligently unto the voice of the LORD thy God, to observe and to do all his commandments which I command thee this day, that the LORD thy God will set thee on high above all nations of the earth." },
          { reference: "1 Samuel 15:22", text: "And Samuel said, Hath the LORD as great delight in burnt offerings and sacrifices, as in obeying the voice of the LORD? Behold, to obey is better than sacrifice." },
          { reference: "Acts 5:29", text: "Then Peter and the other apostles answered and said, We ought to obey God rather than men." },
          { reference: "James 1:22", text: "But be ye doers of the word, and not hearers only, deceiving your own selves." },
          { reference: "Romans 12:2", text: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God." },
        ],
      },
    ],
  },
  {
    category: "Trials & Provision",
    topics: [
      {
        id: "suffering",
        title: "Suffering & Trials",
        emoji: "🔥",
        description: "Finding God's purpose and presence in hard times",
        verses: [
          { reference: "Romans 8:18", text: "For I reckon that the sufferings of this present time are not worthy to be compared with the glory which shall be revealed in us." },
          { reference: "James 1:2-3", text: "My brethren, count it all joy when ye fall into divers temptations; Knowing this, that the trying of your faith worketh patience." },
          { reference: "2 Corinthians 4:17", text: "For our light affliction, which is but for a moment, worketh for us a far more exceeding and eternal weight of glory." },
          { reference: "1 Peter 4:12-13", text: "Beloved, think it not strange concerning the fiery trial which is to try you, as though some strange thing happened unto you: But rejoice, inasmuch as ye are partakers of Christ's sufferings." },
          { reference: "Isaiah 43:2", text: "When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee: when thou walkest through the fire, thou shalt not be burned." },
          { reference: "Psalm 34:19", text: "Many are the afflictions of the righteous: but the LORD delivereth him out of them all." },
          { reference: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
        ],
      },
      {
        id: "provision",
        title: "God's Provision",
        emoji: "🌾",
        description: "Trusting God to meet every need",
        verses: [
          { reference: "Philippians 4:19", text: "But my God shall supply all your need according to his riches in glory by Christ Jesus." },
          { reference: "Matthew 6:31-33", text: "Therefore take no thought, saying, What shall we eat? or, What shall we drink? or, Wherewithal shall we be clothed? But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you." },
          { reference: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want." },
          { reference: "Psalm 37:25", text: "I have been young, and now am old; yet have I not seen the righteous forsaken, nor his seed begging bread." },
          { reference: "Luke 12:24", text: "Consider the ravens: for they neither sow nor reap; which neither have storehouse nor barn; and God feedeth them: how much more are ye better than the fowls?" },
          { reference: "2 Corinthians 9:8", text: "And God is able to make all grace abound toward you; that ye, always having all sufficiency in all things, may abound to every good work." },
        ],
      },
      {
        id: "temptation",
        title: "Temptation",
        emoji: "⚔️",
        description: "Standing firm against sin with God's help",
        verses: [
          { reference: "1 Corinthians 10:13", text: "There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape, that ye may be able to bear it." },
          { reference: "James 4:7", text: "Submit yourselves therefore to God. Resist the devil, and he will flee from you." },
          { reference: "Ephesians 6:11", text: "Put on the whole armour of God, that ye may be able to stand against the wiles of the devil." },
          { reference: "Hebrews 4:15", text: "For we have not an high priest which cannot be touched with the feeling of our infirmities; but was in all points tempted like as we are, yet without sin." },
          { reference: "Matthew 26:41", text: "Watch and pray, that ye enter not into temptation: the spirit indeed is willing, but the flesh is weak." },
          { reference: "Psalm 119:11", text: "Thy word have I hid in mine heart, that I might not sin against thee." },
        ],
      },
    ],
  },
  {
    category: "Purpose & Eternity",
    topics: [
      {
        id: "purpose",
        title: "God's Purpose & Calling",
        emoji: "🧭",
        description: "Discovering the plan God has for your life",
        verses: [
          { reference: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
          { reference: "Ephesians 2:10", text: "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them." },
          { reference: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
          { reference: "Philippians 1:6", text: "Being confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ." },
          { reference: "Psalm 139:13-14", text: "For thou hast possessed my reins: thou hast covered me in my mother's womb. I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works." },
          { reference: "Isaiah 43:7", text: "Even every one that is called by my name: for I have created him for my glory, I have formed him; yea, I have made him." },
          { reference: "1 Corinthians 10:31", text: "Whether therefore ye eat, or drink, or whatsoever ye do, do all to the glory of God." },
        ],
      },
      {
        id: "eternal_life",
        title: "Eternal Life",
        emoji: "♾️",
        description: "The promise of everlasting life in Christ",
        verses: [
          { reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
          { reference: "John 11:25-26", text: "Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live: And whosoever liveth and believeth in me shall never die." },
          { reference: "Romans 6:23", text: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord." },
          { reference: "Revelation 21:4", text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away." },
          { reference: "John 14:2-3", text: "In my Father's house are many mansions: if it were not so, I would have told you. I go to prepare a place for you. And if I go and prepare a place for you, I will come again, and receive you unto myself." },
          { reference: "1 Thessalonians 4:17", text: "Then we which are alive and remain shall be caught up together with them in the clouds, to meet the Lord in the air: and so shall we ever be with the Lord." },
          { reference: "1 John 5:13", text: "These things have I written unto you that believe on the name of the Son of God; that ye may know that ye have eternal life." },
        ],
      },
      {
        id: "holy_spirit",
        title: "Holy Spirit",
        emoji: "🔥",
        description: "The presence and power of God living in us",
        verses: [
          { reference: "John 14:16-17", text: "And I will pray the Father, and he shall give you another Comforter, that he may abide with you for ever; Even the Spirit of truth; whom the world cannot receive, because it seeth him not, neither knoweth him: but ye know him; for he dwelleth with you, and shall be in you." },
          { reference: "Acts 1:8", text: "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth." },
          { reference: "Galatians 5:22-23", text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance: against such there is no law." },
          { reference: "Romans 8:26", text: "Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered." },
          { reference: "1 Corinthians 3:16", text: "Know ye not that ye are the temple of God, and that the Spirit of God dwelleth in you?" },
          { reference: "Ephesians 5:18", text: "And be not drunk with wine, wherein is excess; but be filled with the Spirit." },
        ],
      },
    ],
  },
];

// Flat list of all topics for search
export const ALL_TOPICS: Topic[] = TOPICAL_BIBLE.flatMap((cat) => cat.topics);
