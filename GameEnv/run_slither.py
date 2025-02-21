# run_gymnasium_env.py

import gymnasium
import gymnasium_env
from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env
from stable_baselines3.common.evaluation import evaluate_policy
from gymnasium import spaces
import numpy as np
from gymnasium.spaces.utils import flatten_space

env = gymnasium.make('gymnasium_env/slither_world')
# class FlattenObservationWrapper(gymnasium.ObservationWrapper):
#     def __init__(self, env):
#         super().__init__(env)
#         self.observation_space = spaces.Box(
#             low=-np.inf, high=np.inf, shape=(10 * 2, ), dtype=np.float32  # Adjust according to flattened shape
#         )

#     def observation(self, observation):
#         # Flatten the body part coordinates and add to other features (size, score)
#         # body_flattened = observation["mySnake"]["body"].flatten()  # Flatten the 2D body array
#         print("thisssss",flatten_space(observation).shape)
#         return flatten_space(observation)


# env = FlattenObservationWrapper(env)
observation, info = env.reset()


episode_over = False
while not episode_over:
    action = env.action_space.sample()  # agent policy that uses the observation and info
    observation, reward, terminated, truncated, info = env.step(action)

    episode_over = terminated or truncated

# Create environment

# Instantiate the agent
model = PPO('MultiInputPolicy', env, verbose=1)
# Train the agent
model.learn(total_timesteps=int(2e5))

