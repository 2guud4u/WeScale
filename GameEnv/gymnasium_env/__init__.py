from gymnasium.envs.registration import register

register(
    id="gymnasium_env/slither_world",
    entry_point="gymnasium_env.envs:SlitherWorldEnv",
)
