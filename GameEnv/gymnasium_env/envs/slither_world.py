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
rewards = {
    "die": -100,
    "food": 1,
    "kill": 50,
    "growth": 5,
    "survives": 0.1,
    "towards-food": 0.05,
    "away-food": -0.05
}


snake_dict_space = spaces.Dict({
    'body': spaces.Sequence(spaces.Box(
        low=-float('inf'),
        high=float('inf'),
        shape=(2,),
        
    )),
    'size': spaces.Discrete(1000),
    'score': spaces.Discrete(1000000),
    'name': spaces.Text(max_length=100)
})
food_dict_space = spaces.Dict({
    "foodLoc": spaces.Box(low=-10000, high=10000, shape=(2,), dtype=np.float32),
    "size": spaces.Discrete(1000)
})


class SlitherWorldEnv(gym.Env):
    metadata = {"render_modes": ["human", "rgb_array"], "render_fps": 4}

    def __init__(self, render_mode=None, size=5):
        self.size = size  # The size of the square grid
        self.window_size = 512  # The size of the PyGame window

        # Observations are dictionaries with the agent's and the target's location.
        # Each location is encoded as an element of {0, ..., `size`}^2,
        # i.e. MultiDiscrete([size, size]).
        self.observation_space = spaces.Dict({
            'mySnake': snake_dict_space,
            'otherSnakes': spaces.Sequence(
                snake_dict_space
            ),
            'foodList': spaces.Sequence(
                food_dict_space
            ),
          
            })
            
        # })

        # We have 8 actions, corresponding to "right", "up", "left", "down", "up-right", "up-left", "down-right", "down-left"
        self.action_space = spaces.Box(low=np.array([-1000, -1000]), high=np.array([1000, 1000]), dtype=np.int32)

        """
        The following dictionary maps abstract actions from `self.action_space` to 
        the direction we will walk in if that action is taken.
        i.e. 0 corresponds to "right", 1 to "up" etc.
        """

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
    def createObs(self,data):
        obs = dict()
        obs["mySnake"] = dict()
        obs["mySnake"] = {
            "size": np.int64(data["mySnake"]["size"]),
            "score": np.int64(data["mySnake"]["score"]),
            "name": data["mySnake"]["name"],
            "body": tuple([np.array([loc['x'], loc['y']], dtype=np.float32) for loc in data["mySnake"]["body"]])
            }
        
        obs["otherSnakes"] = tuple([{
            "size": int(snake["size"]),
            "score": int(snake["score"]),
            "name": snake["name"],
            "body": tuple([np.array([loc['x'], loc['y']], dtype=np.float32) for loc in snake["body"]])
            } for snake in data["otherSnakesList"]])
        
        obs["foodList"] = tuple([{
            "foodLoc": np.array([food["foodLoc"][0], food["foodLoc"][1]], dtype=np.float32),
             "size": np.int64(food["size"]),
        } for food in data["foodList"][:5]])

        return obs
    
    def reset(self, seed=None, options=None):
        # We need the following line to seed self.np_random
        super().reset(seed=seed)
        observation = dict()
        stateUrl = baseUrl+"/reset"
        reqString = sendGetRequest(stateUrl)
        reqDict = json.loads(reqString)
        observation = self.createObs(reqDict)
        info = {}
        return observation, info

    def step(self, action):
        x, y = action.astype(int)

        stepUrl = baseUrl+"/step" + f"/{x}" + f"/{y}"
        reqString = sendGetRequest(stepUrl)
        reqDict = json.loads(reqString)
        observation = self.createObs(reqDict)
        reward = reqDict["mySnake"]["score"]
        terminated = reqDict["dieBool"]
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
    reqString= sendGetRequest("http://localhost:3000/state")
    reqDict = json.loads(reqString)
    print(reqDict["mySnake"]["score"])