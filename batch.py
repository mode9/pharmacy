#!/usr/bin/env python3

from decimal import Decimal
import json
from pathlib import Path
from urllib import parse
import os
import logging

from dotenv import load_dotenv
import requests

APP_DIR = Path(__file__).resolve(strict=True).parent
logger = logging.getLogger(__name__)


class Pharmacy:
    def __init__(self, data):
        super().__init__()
        self.data = data
        self.__x = None
        self.__y = None

    @property
    def address(self):
        return self.data.get('address_road', self.data.get('address'))

    @property
    def x(self):
        return self.__x

    @property
    def y(self):
        return self.__y

    @x.setter
    def x(self, val):
        if val is not None:
            self.__x = float(val)

    @y.setter
    def y(self, val):
        if val is not None:
            self.__y = float(val)

    def fetch_coords(self, addr=None):
        kakao_key = os.getenv('KAKAO_KEY')
        url = f'http://dapi.kakao.com/v2/local/search/address.json'
        addr = addr or self.address
        params = {
            'page': 1,
            'size': 10,
            'query': addr,
        }
        # TODO: origin HOST?
        headers = {
          'Authorization': f'KakaoAK {kakao_key}',
          'KA': 'sdk/4.4.1 os/javascript lang/ko-KR device/MacIntel origin/http%3A%2F%2Flocalhost%3A3000',
        }
        res = requests.get(url, params=params, headers=headers)
        if res.ok:
            self.x, self.y = self.extract_coords_from(res)
        return self.x and self.y

    def extract_coords_from(self, response):
        try:
            context = json.loads(response.content)['documents'][0]
            x = context.get('x')
            y = context.get('y')
            return x, y
        except IndexError as e:
            logger.exception(e)
            return None, None

    def to_dict(self):
        self.data.update({'x': self.x, 'y': self.y})
        return self.data


def main():
    new_data = []
    err_data = []
    with open(APP_DIR / 'data.json', 'r') as f:
        data = json.load(f)

    for row in data:
        pharmacy = Pharmacy(row)
        if pharmacy.fetch_coords() or pharmacy.fetch_coords(pharmacy.data.get('address')):
            new_data.append(pharmacy.to_dict())
        else:
            err_data.append(pharmacy.to_dict())

    with open(APP_DIR / 'data_new.json', 'w+') as f:
        json.dump(new_data, f)

    with open(APP_DIR / 'data_err.json', 'w+') as f:
        json.dump(err_data, f)


if __name__ == '__main__':
    # load_dotenv(verbose=True)
    # main()
    with open(APP_DIR / 'data_err.json', 'r') as f:
        data = json.load(f)
        for row in data:
            print(row)
