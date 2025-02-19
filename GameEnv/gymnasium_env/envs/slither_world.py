from enum import Enum
import gymnasium as gym
from gymnasium import spaces
import json
import numpy as np
import requests

baseUrl = "http://localhost:3000"  # Change port if needed


def sendGetRequest(url):
    try:
        response = requests.get(url)
        return response.text
    except:
        print(response)
        return
    

GameConfig = {
    "game_H": 1000,
    "game_W": 1000,
    "NSnake": 20,
}
rewards = {
    "die": -100,
    "food": 1,
    "kill": 50,
    "growth": 5,
    "survives": 0.1,
    "towards-food": 0.05,
    "away-food": -0.05
}

class Actions(Enum):
    right = 0
    up_right = 1
    up = 2
    up_left = 3
    left = 4
    down_left = 5
    down = 6
    down_right = 7

class GridWorldEnv(gym.Env):
    metadata = {"render_modes": ["human", "rgb_array"], "render_fps": 4}

    def __init__(self, render_mode=None, size=5):
        self.size = size  # The size of the square grid
        self.window_size = 512  # The size of the PyGame window

        # Observations are dictionaries with the agent's and the target's location.
        # Each location is encoded as an element of {0, ..., `size`}^2,
        # i.e. MultiDiscrete([size, size]).
        self.observation_space = spaces.Dict(
            {
                "agent": spaces.Box(0, size - 1, shape=(2,), dtype=int),
                "target": spaces.Box(0, size - 1, shape=(2,), dtype=int),
            }
        )

        # We have 8 actions, corresponding to "right", "up", "left", "down", "up-right", "up-left", "down-right", "down-left"
        self.action_space = spaces.Box(low=np.array([-1000, -1000]), high=np.array([1000, 1000]), dtype=np.int32)

        """
        The following dictionary maps abstract actions from `self.action_space` to 
        the direction we will walk in if that action is taken.
        i.e. 0 corresponds to "right", 1 to "up" etc.
        """
        self._action_to_direction = {
            Actions.right.value: np.array([1, 0]),
            Actions.up_right.value: np.array([1, 1]),
            Actions.up.value: np.array([0, 1]),
            Actions.up_left.value: np.array([-1, 1]),
            Actions.left.value: np.array([-1, 0]),
            Actions.down_left.value: np.array([-1, -1]),
            Actions.down.value: np.array([0, -1]),
            Actions.down_right.value: np.array([1, -1]),
        }

        assert render_mode is None or render_mode in self.metadata["render_modes"]
        self.render_mode = render_mode

        """
        If human-rendering is used, `self.window` will be a reference
        to the window that we draw to. `self.clock` will be a clock that is used
        to ensure that the environment is rendered at the correct framerate in
        human-mode. They will remain `None` until human-mode is used for the
        first time.
        """
        self.window = None
        self.clock = None

    def _get_obs(self):
        return {"agent": self._agent_location, "target": self._target_location}

    def _get_info(self):
        return {

        }

    def reset(self, seed=None, options=None):
        # We need the following line to seed self.np_random
        super().reset(seed=seed)
        
        observation = {}
        reward = 0
        terminated = False
        info = {}

        return observation, info

    def step(self, action):
        x, y = action

        stepUrl = baseUrl+"/step" + f"/{x}" + f"/{y}"
        reqString = sendGetRequest(stepUrl)
        reqDict = json.loads(reqString)


        observation = {}
        reward = reqDict.mySnake["score"]
        terminated = reqDict["die"]
        info = {}
        return observation, reward, terminated, False, info

    def render(self):
        if self.render_mode == "rgb_array":
            return self._render_frame()

    def _render_frame(self):
        
        return

    def close(self):
        return 

if __name__ == "__main__":
    reqString= sendGetRequest("http://localhost:3000/step/1/1")
    reqDict = json.loads(reqString)
    print(reqDict["mySnake"])