import gymnasium 
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
from stable_baselines3.common.evaluation import evaluate_policy
from stable_baselines3.common.monitor import Monitor

import gymnasium
import gymnasium_env
from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env
from stable_baselines3.common.evaluation import evaluate_policy
from gymnasium import spaces
import numpy as np
from gymnasium.spaces.utils import flatten_space
import pprint
from gymnasium import envs
from gymnasium.wrappers import FlattenObservation
from stable_baselines3.common.monitor import Monitor
# Create environment
env = gymnasium.make('gymnasium_env/slither_world')

# Wrap the environment in a vectorized environment for faster training
env = DummyVecEnv([lambda: env])

# Initialize PPO model
model = PPO(
    policy='MultiInputPolicy',  # Policy for handling multiple inputs
    env=env,                    # The environment to train on
    n_steps=1024,               # Number of steps per update (more steps = slower, but more stable)
    batch_size=64,              # Batch size for each update
    n_epochs=4,                 # Number of epochs for each training update
    gamma=0.999,                # Discount factor for future rewards
    gae_lambda=0.98,            # GAE lambda for advantage estimation
    ent_coef=0.01,              # Entropy coefficient to encourage exploration
    verbose=1                   # Verbosity for logging progress
)

# Train the agent (adjust the number of timesteps for quick feedback)
model.learn(total_timesteps=int(1000))  # Use a higher value like 1000 for more meaningful training

# Save the trained model
model_name = "ppo-snake-v2"
model.save(model_name)

# Evaluation
eval_env = Monitor(gymnasium.make("gymnasium_env/slither_world"))  # Use Monitor for logging evaluation
mean_reward, std_reward = evaluate_policy(model, eval_env, n_eval_episodes=10, deterministic=True)

# Print evaluation results
print(f"mean_reward={mean_reward:.2f} +/- {std_reward:.2f}")
