
I realized the potential of Kalshi and prediction markets in general in early 2024. I even tried to invest, but obviously it was private at that time, so I wondered what I could to work with them. Later in 2024 I realized that if LLMs can accurately predict the next word in text, and can be turned conversational through post training, then they can also likely excel at predictive tasks, especially given the massive volume of data they consume. I didn't have the hardware or money to train any model to do this though. 

In January 2025, I began building a bot that detects Kalshi markets, specifically Movie Rotten Tomatoes score markets, and then researches the movie, uses LLMs as well as tabular data processing to model a RT score distribution, then using the implied prices from the distributions probabilities as price targets on Kalshi markets, running 24/7.

I tried a ton of different approaches to data modeling and trading. 
For data:
- Exa, Google news articles
- Reddit posts in movie subreddits
- The movie's rotten tomatoes page details itself (genre, rating, etc.)
- The past RT scores of directors, actors, and writers
- Youtube Movie trailer comments
For modeling:
- Sentiment analysis models
- LLM prediction distribution through 10+ prompting strategies
- Plain MLP models
- Text Embeddings of news articles
For trading:
- Market making
- RL-based trading
- Simple implied value-based trading
- Orderbook modeling

I ended up shutting down the bot due to my current job's heavy trading restrictions. Before that, I kept having to redeploy it after seeing poor performance and discovering another bug/data leak that messed with performance. There wasn't a ton of liquidity in these markets and returns were noisy, so once I finally got things stable it was only making about $10-20/month. I never wanted to put that much money in it if it wasn't proving consistent edge. I also just realized this is not a business I want to be in for many reasons. 

The underlying infrastructure of this bot was the start of Scepter. 

## Files:
profit.png - A graph of my backtested strategy over time. The orange is portfolio value and blue is cash. The time spans from roughly Jan-Nov. 2025. As you can see around mid year, my edge mostly goes away. I suspect someone was beating me to the trades. Unfortunately I only deployed the model after that. 

training_algorithm.png - An overview of my data pipeline from Exa search results to predictions

Code is not linked as it's somewhat proprietary