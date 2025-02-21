# run_gymnasium_env.py

import gymnasium
import gymnasium_env
env = gymnasium.make('gymnasium_env/slither_world')
observation, info = env.reset()


episode_over = False
while not episode_over:
    action = env.action_space.sample()  # agent policy that uses the observation and info
    observation, reward, terminated, truncated, info = env.step(action)

    episode_over = terminated or truncated

# Ensure observations match the expected space
# obs_space = env.observation_space

# obs, _ = env.reset()

# # print(obs)
# # Validate before returning
# try:
#     assert env.observation_space.contains(obs), f"ERROR: Observation does not match observation space! Observation: {obs}"
# except AssertionError as e:
#     print(e)
