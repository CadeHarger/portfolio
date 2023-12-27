# Personal Projects

This directory contains mostly Colab notebooks I created out of personal interest. All surround a core idea that is my own and I try to code everything myself, but small portions of code may be taken from the internet. 

### Chess_AI_Round_3.ipynb

This was the first in-depth AI project I ever did on my own. I had been playing chess a lot when I got into AI, so I figured why not try to make AI that can play chess? I used a Deep Convolutional Network to make moves based on the board configuration. I struggled representing the board configuration and properly parsing the data I scraped from the internet. I then tested it's capabilities by having it play against itself using Minimax with Alpha-Beta pruning. This presented a whole new set of challenges. Ultimately, the project was succesful in that I learned a lot, but not much more than that. A more in-depth description of my process can be found [here](https://chargerml.wordpress.com/2022/11/21/starting-my-first-project-chess-ai/)

### Chess_AI_Round_4.ipynb

This was my attempt to improve upon the previous chess AI I had written by using Transformers. It made sense to me at the time that their inductive bias would make sense for chess. This project wasn't any more succesful than the previous attempt, but it highlighted to me the key problem and solution. The AI would make moves that were very intelligent and that a grandmaster would make, but would then blunder its queen on the next move. I think that it was just trying to mimic the high-level play that it trained on in my dataset instead of actually having any game understanding. Deepmind's AlphaZero used a reinforcement learning algorithm to solve this. That way, not only did it learn concepts from the ground up, but it also got rid of most human bias that would come from training on humans. I completed Deepmind and UCL's YouTube RL course only to find that I didn't have enough compute to train such a model on my own and have it be decent. 

### Conditional_Audio_Synthesis.ipynb

This project was my attempt to gain experience with audio and to test a [paper I read](https://arxiv.org/abs/1909.13062), where the authors added an implicit discriminator inside the encoder of a VAE in order to try to combine the realistic benefits of a GAN with the latent space and accurate benefits of a VAE. I added my own condition to the model so the user could control generation that way as well. I used an audio dataset of 30 different spoken words with thousands of samples each. I could not get this project to work, and I learned that audio synthesis is very hard and an emerging field. 

### De_Conditioned_VAE.ipynb

This was my attempt at a new form of generative AI, inspired by the [Pix2pix paper](https://arxiv.org/abs/1611.07004). I was going to train a Conditional VAE on a dataset of butterfly images, with the condition being the edges of the butterfly (after an edge detection algorithm was ran). I was then going to modify the architecture so that before the encoded image is passed to the latent space, another network attempts to decode the condition (edge data) from the encoding. The encoder is then trained to minimize the chances of that happening. Then, the edge data is passed along with the latent space. The point of this is so that a user can effectively "retexturize" the butterfly with another species' pattern, without changing the actual shape of the butterfly to match the species. This would allow for the creation of a tool like [Pix2pix](https://affinelayer.com/pixsrv/), except the user would have control over the texturization of their drawing as well. I also just thought it was an interesting idea to try to have a model 'remove' information from a vector. 
Unfortunately, I couldn't even get the CVAE to run properly. I want to revisit this at some point in the future.

### Naive_Image_Generation_from_Classifier.ipynb

Before I was aware of the existence of GANs or Diffusion, I wondered how one could generate images from a classifier. This just optimizes a certain output by adding random noise and hoping it sticks. It didn't really work, but that is interesting in itself and taught me how neural networks don't deal with out of domain data very well. I now know there are much better ways to achieve this than just adding random noise. 

### Neural_Network_From_Scratch.ipynb

I created a neural network without using an ML library, with the ability to modify layers, neurons, activation functions, or losses. This was one of the most beneficial projects I did as I had to watch a lot of YouTube videos to be confident I got the math correct. Since it was written entirely in Python, I learned a lot about Python optimization, as it took like 40 minutes for one epoch to finish on the MNIST. The accuracy increased though and I was able to verify it worked, which was very satisfying.

### Stock_Market_AI.ipynb

This was my first attempt at predicting the stock market. I just used 1D Convolution layers, which seemed the most logical. Needless to say, I didn't have any success.

### Stock_Market_Round_2.ipynb

This was my second attempt at predicting the stock market. This time, I used a VAE to try to encode the graph missing the final few days and then decode it. This also did not work. I tried again using a different method in [one of my School Projects](/School_Projects/AI%20Final%3A%20GAN%20Stock%20Prediction/).

### Trump_Speech_Generation.ipynb

This was probably my most fun project. I collected Trump tweets and speech data and then used an LSTM to train to predict the next token. I learned a lot about data cleaning through this project, as I collected and cleaned a lot of the data myself. I also made the model overfit, as it tended to result in better generations. The dataset was ultimately not big enough to present very great results, and there were a lot of tokens with only one mention. I hope to eventually come back to this project once there is more data. I will also use a Transformer, as well as potentially using some pre-made embeddings.