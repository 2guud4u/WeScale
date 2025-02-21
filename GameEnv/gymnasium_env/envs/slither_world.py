from enum import Enum
import gymnasium as gym
from gymnasium import spaces
import json
import numpy as np
import requests

baseUrl = "http://localhost:3000"  # Change port if needed

FOOD_AMOUNT = 200
BODY_AMOUNT = 100
OTHER_SNAKES_AMOUNT = 10
BODY_SHAPE = 3
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
food_dict_space = spaces.Box(low=-10000, high=10000, shape=(3,1), dtype=np.float32)



class SlitherWorldEnv(gym.Env):
    metadata = {"render_modes": ["human", "rgb_array"], "render_fps": 4}

    def __init__(self, render_mode=None, size=5):
        self.size = size  # The size of the square grid
        self.window_size = 512  # The size of the PyGame window
        self.observation_space = spaces.Dict({
            # 'mySnake': snake_dict_space,
            # 'otherSnakes': spaces.Sequence(
            #     snake_dict_space
            # ),
            # "otherBodies": spaces.Box(low=-10000, high=10000, shape=(BODY_AMOUNT*2,), dtype=np.float32),
            # "otherHeads": spaces.Box(low=-10000, high=10000, shape=(OTHER_SNAKES_AMOUNT*BODY_SHAPE*BODY_AMOUNT,), dtype=np.float32),
            "otherSnakesList": spaces.Box(low=-10000, high=10000, shape=(OTHER_SNAKES_AMOUNT*BODY_SHAPE*BODY_AMOUNT,), dtype=np.float32),
            'mySnake': spaces.Box(low=-10000, high=10000, shape=(2,), dtype=np.float32),
            'mySnakeBody': spaces.Box(low=-10000, high=10000, shape=(BODY_AMOUNT*2,), dtype=np.float32),
            'foodList': spaces.Box(low=-10000, high=10000, shape=(FOOD_AMOUNT*3,), dtype=np.float32)
          
            })
            
        # })

        # We have 8 actions, corresponding to "right", "up", "left", "down", "up-right", "up-left", "down-right", "down-left"
        # self.action_space = spaces.Box(low=np.array([-1000, -1000]), high=np.array([1000, 1000]), dtype=np.int32)
        self.action_space = spaces.MultiDiscrete([200000, 200001])  # Values will be in [0, 2000]

        assert render_mode is None or render_mode in self.metadata["render_modes"]
        self.render_mode = render_mode
        self.window = None
        self.clock = None
        self.lastState = {}
        self.firstState = True

    def _get_obs(self):
        return {"agent": self._agent_location, "target": self._target_location}

    def _get_info(self):
        return {

        }
    def createObs(self,data):
        obs = dict()

        mySnakeBody = [np.array([loc['x'], loc['y']], dtype=np.float32) for loc in data["mySnake"]["body"]]
        obs["mySnakeBody"] = np.array(mySnakeBody, dtype=np.float32).flatten()
        #padding
        if len(obs["mySnakeBody"]) < BODY_AMOUNT*2:
            obs["mySnakeBody"] = np.pad(obs["mySnakeBody"], (0, BODY_AMOUNT*2-len(obs["mySnakeBody"])), 'constant')
        elif len(obs["mySnakeBody"]) > BODY_AMOUNT*2:
            obs["mySnakeBody"] = obs["mySnakeBody"][:BODY_AMOUNT*2]

        obs["mySnake"] = np.array([data["mySnake"]["size"], data["mySnake"]["score"]], dtype=np.float32)
        
        otherSnakes = []
        for snake in data["otherSnakesList"][:OTHER_SNAKES_AMOUNT]:
            thisSnake = []
            thisSnake=np.array([np.array([loc['x'], loc['y'], snake["size"]], dtype=np.float32) for loc in snake["body"]])
            ###padding
            if len(thisSnake) < BODY_SHAPE*BODY_AMOUNT:
                thisSnake = np.pad(thisSnake, ((0, BODY_SHAPE*BODY_AMOUNT-len(thisSnake)), (0, 0)), 'constant')
            elif len(thisSnake) > BODY_SHAPE*BODY_AMOUNT:
                thisSnake = thisSnake[:BODY_SHAPE*BODY_AMOUNT]
            otherSnakes.append(thisSnake)
            
        
        
        obs["otherSnakesList"] = np.array(otherSnakes, dtype=np.float32).flatten()
        #padding
        if len(obs["otherSnakesList"]) < OTHER_SNAKES_AMOUNT*BODY_SHAPE*BODY_AMOUNT:
            obs["otherSnakesList"] = np.pad(obs["otherSnakesList"], (0, OTHER_SNAKES_AMOUNT*BODY_SHAPE*BODY_AMOUNT-len(obs["otherSnakesList"])), 'constant')
        elif len(obs["otherSnakesList"]) > OTHER_SNAKES_AMOUNT*BODY_SHAPE*BODY_AMOUNT:
            obs["otherSnakesList"] = obs["otherSnakesList"][:OTHER_SNAKES_AMOUNT*BODY_SHAPE*BODY_AMOUNT]

        foods = [[food["foodLoc"][0], food["foodLoc"][1], food["size"]] for food in data["foodList"][:FOOD_AMOUNT*3]]
        obs["foodList"] = np.array(foods, dtype=np.float32).flatten()
        #padding
        if len(obs["foodList"]) < FOOD_AMOUNT*3:
            obs["foodList"] = np.pad(obs["foodList"], (0, FOOD_AMOUNT*3-len(obs["foodList"])), 'constant')
        elif len(obs["foodList"]) > FOOD_AMOUNT*3:
            obs["foodList"] = obs["foodList"][:FOOD_AMOUNT*3]

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
        action = action - 100000
        
        x, y = action
        stepUrl = baseUrl+"/step" + f"/{x}" + f"/{y}"
        reqString = sendGetRequest(stepUrl)
        reqDict = json.loads(reqString)
        observation = self.createObs(reqDict)
        # create reward func
        reward = self.reward(reqDict)
        terminated = reqDict["dieBool"]
        info = {}
        self.storeLastState(reqDict)
        firstState = False
        return observation, reward, terminated, False, info

    def storeLastState(self, req):
        self.lastState = req

    def reward(self, req):
        reward = 0
        terminated = req['dieBool']

        step_count = req['stepCount']
        adjusted_score = req['mySnake']['score']/step_count

        mySnake_x = req['mySnake']['x']
        mySnake_y = req['mySnake']['y']

        if not self.firstState:
            last_x = self.lastState['mySnake']['x']
            last_y = self.lastState['mySnake']['y']
        else:
            last_x = mySnake_x
            last_y = mySnake_y

        mySnake_size = req['mySnake']['size']
        last_size = req['mySnake']['size']

        size_diff = mySnake_size-last_size

        x_diff = mySnake_x-last_x
        y_diff = mySnake_y-last_y

        if terminated:
            reward -= rewards['die']
            return reward
        if size_diff > 0:
            reward += rewards['growth']
        reward += rewards['survives']
        reward += adjusted_score

        return reward

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