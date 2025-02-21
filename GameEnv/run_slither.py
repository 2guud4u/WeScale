# run_gymnasium_env.py

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
env = gymnasium.make('gymnasium_env/slither_world')
# env =make_vec_env('gymnasium_env/slither_world', n_envs=16)
# wrapped_env = FlattenObservation(env)
observation, info = env.reset()
# wrapped_env = FlattenObservation(env)
# print(wrapped_env.observation_space)

model = PPO(
    policy = 'MultiInputPolicy',
    env = env,
    n_steps = 1024,
    batch_size = 64,
    n_epochs = 4,
    gamma = 0.999,
    gae_lambda = 0.98,
    ent_coef = 0.01,
    verbose=1)
# Train the agent
model.learn(total_timesteps=int(2e5))

model_name = "ppo-snake-v1"
model.save(model_name)

eval_env = Monitor(gymnasium.make("gymnasium_env/slither_world"))
mean_reward, std_reward = evaluate_policy(model, eval_env, n_eval_episodes=10, deterministic=True)
print(f"mean_reward={mean_reward:.2f} +/- {std_reward}")


