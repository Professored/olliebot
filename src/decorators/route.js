/*
* The MIT License (MIT)
*
* Copyright (c) 2020 CantSayIHave
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
* OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*/

import wrap from './async-wrap'
import DiscordBot from '../core/bot';

const route = (path: string, routeCallback) => {
  return async function (callback, args, name, type) {
    const bot: DiscordBot = args[0];
    const message = args[1];
    const commandArgs = args[2];

    if (commandArgs.length && commandArgs[0] === path) {
      // remove triggering arg so future routing works
      commandArgs.shift();
      await routeCallback(bot, message, commandArgs);
    } else {
      await callback();
    }
  }
};

export default function (path: string, callback) {
  return function (target, key, descriptor) {
    return wrap(route(path, callback))(target, key, descriptor);
  }
}