import gymnasium as gym
import numpy as np

rewards = {
    "die": -100,
    "food": 1,
    "kill": 50,
    "growth": 5,
    "survives": 0.1,
    "towards-food": 0.05,
    "away-food": -0.05
}

class ClipReward(gym.RewardWrapper):
    def __init__(self, env, min_reward, max_reward):
        super().__init__(env)
        self.min_reward = min_reward
        self.max_reward = max_reward
        self.reward_range = (min_reward, max_reward)

    def reward(self, reward):
        return np.clip(reward, self.min_reward, self.max_reward)
