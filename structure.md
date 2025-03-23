omi-hackathon/
│
├── public/                     # Static files
│   ├── index.html              
│
├── src/                        
│   ├── components/             
│   │   ├── Upload.jsx          # Upload data from the omni
│   │   ├── Visualization.jsx    # Component for displaying visualizations
│   │   ├── Analytics.jsx        # Component for showing analytics
│   │   └── FollowUps.jsx        # Component for suggesting follow-ups
│   │
│   ├── pages/                  
│   │   ├── Home           
│   │   └── Results        
│   │
│   ├── services/               
│   │   ├── api.js             
│   │   └── dataProcessing.js    
│   ├── utils/                  
│   │   ├── visualizationUtils.js 
│   │   └── analyticsUtils.js    
│   │
│   ├── styles/                 
│   │   ├── App.css             
│   │   └── components.css       
│   │
│   ├── App.jsx                 
│   └── index.js                
│
├── .env                        
├── package.json                
└── README.md                   


# i think we should be able to generate a new person in the data base (that you can look in whatever) and analyze them
# but also you should be able to add in and upload new data on top of existing data and re-analyze
# we can also rate how good the conversation is -> and give pointers & insights
# based off an algorithm if can quantify how good the convo is and give suggestions for next time


# networking assistant and tracker