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

/*const hasAuth = async (bot, message) => {
  const authorMember = await message.guild.fetchMember(message.author);
  const guildData = await bot.fetchGuildData(message.guild);

  if (authorMember.id === message.guild.owner.id) return true;
  if (authorMember.id === bot.ownerID) return true;
  if (authorMember.hasPermission("ADMINISTRATOR")) return true;
  for (let role of authorMember.roles.keys()) {
    if (guildData.hasModeRole(role)) return true;
  }
  return false;
};*/

async function modOnly (callback, args, name, type) {
  const bot: DiscordBot = args[0];
  const message = args[1];
  if (!message.guild) {
    const m = await message.channel.send(`I'm afraid this command must be run in a guild.`);
    await m.delete(4000);
    return;
  }
  const authorMember = await message.guild.members.fetch(message.author);

  const auth = await bot.checkMod(authorMember);
  if (auth) {
    await callback();
  } else {
    const m = await message.channel.send(`I'm sorry ${message.author.mention}, I'm afraid I can't do that.`);
    await m.delete(4000);
  }
}

export default function (target, key, descriptor) {
  return wrap(modOnly)(target, key, descriptor);
}