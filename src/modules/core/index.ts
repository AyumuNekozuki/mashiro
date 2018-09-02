import 藍 from '../../ai';
import IModule from '../../module';
import MessageLike from '../../message-like';
import serifs from '../../serifs';
import Friend from '../../friend';
import getDate from '../../utils/get-date';
import includes from '../../utils/includes';

function zeroPadding(num: number, length: number): string {
	return ('0000000000' + num).slice(-length);
}

const titles = ['さん', 'くん', '君', 'ちゃん', '様', '先生'];

const invalidChars = ['@', '#', '*', ':', '(', '[', ' ', '　'];

export default class CoreModule implements IModule {
	public readonly name = 'core';
	private ai: 藍;

	public install = (ai: 藍) => {
		this.ai = ai;

		this.crawleBirthday();
		setInterval(this.crawleBirthday, 1000 * 60 * 3);
	}

	public onMention = (msg: MessageLike) => {
		if (!msg.text) return false;

		return (
			this.setName(msg) ||
			this.greet(msg) ||
			this.nadenade(msg) ||
			this.kawaii(msg) ||
			this.humu(msg) ||
			this.batou(msg) ||
			this.ponkotu(msg)
		);
	}

	/**
	 * 誕生日のユーザーがいないかチェック(いたら祝う)
	 */
	private crawleBirthday = () => {
		const now = new Date();
		const m = now.getMonth();
		const d = now.getDate();
		// Misskeyの誕生日は 2018-06-16 のような形式
		const today = `${zeroPadding(m + 1, 2)}-${d}`;

		const birthFriends = this.ai.friends.find({
			'user.profile.birthday': { '$regex': new RegExp('-' + today + '$') }
		} as any);

		birthFriends.forEach(f => {
			const friend = new Friend(this.ai, { doc: f });

			// 親愛度が3以上必要
			if (friend.love < 3) return;

			const data = friend.getPerModulesData(this);

			if (data.lastBirthdayChecked == today) return;

			data.lastBirthdayChecked = today;
			friend.setPerModulesData(this, data);

			const text = serifs.core.happyBirthday(friend.name);

			this.ai.sendMessage(friend.userId, {
				text: text
			});
		});
	}

	private setName = (msg: MessageLike): boolean => {
		if (!msg.text) return false;
		if (!msg.text.includes('って呼んで')) return false;
		if (msg.text.startsWith('って呼んで')) return false;

		// メッセージのみ
		if (!msg.isMessage) return true;

		if (msg.friend.love < 5) {
			msg.reply(serifs.core.requireMoreLove);
			return true;
		}

		const name = msg.text.match(/^(.+?)って呼んで/)[1];

		if (name.length > 10) {
			msg.reply(serifs.core.tooLong);
			return true;
		}

		if (invalidChars.some(c => name.includes(c))) {
			msg.reply(serifs.core.invalidName);
			return true;
		}

		const withSan = titles.some(t => name.endsWith(t));

		if (withSan) {
			msg.friend.updateName(name);
			msg.reply(serifs.core.setNameOk(name));
		} else {
			msg.reply(serifs.core.san).then(reply => {
				this.ai.subscribeReply(this, msg.userId, msg.isMessage, msg.isMessage ? msg.userId : reply.id, {
					name: name
				});
			});
		}

		return true;
	}

	private greet = (msg: MessageLike): boolean => {
		if (msg.text == null) return false;

		const incLove = () => {
			//#region 1日に1回だけ親愛度を上げる
			const today = getDate();

			const data = msg.friend.getPerModulesData(this);

			if (data.lastGreetedAt == today) return;

			data.lastGreetedAt = today;
			msg.friend.setPerModulesData(this, data);

			msg.friend.incLove();
			//#endregion
		};

		const tension = (msg.text.match(/[！!]{2,}/g) || [''])
			.sort((a, b) => a.length < b.length ? 1 : -1)[0]
			.substr(1);

		if (includes(msg.text, ['こんにちは', 'こんにちわ'])) {
			msg.reply(serifs.core.hello(msg.friend.name));
			incLove();
			return true;
		}

		if (includes(msg.text, ['こんばんは', 'こんばんわ'])) {
			msg.reply(serifs.core.helloNight(msg.friend.name));
			incLove();
			return true;
		}

		if (includes(msg.text, ['おは', 'お早う'])) {
			msg.reply(serifs.core.goodMorning(tension, msg.friend.name));
			incLove();
			return true;
		}

		if (includes(msg.text, ['おやすみ', 'お休み'])) {
			msg.reply(serifs.core.goodNight(msg.friend.name));
			incLove();
			return true;
		}

		return false;
	}

	private nadenade = (msg: MessageLike): boolean => {
		if (!includes(msg.text, ['なでなで'])) return false;

		// メッセージのみ
		if (!msg.isMessage) return true;

		//#region 1日に1回だけ親愛度を上げる(嫌われてない場合のみ)
		if (msg.friend.love >= 0) {
			const today = getDate();

			const data = msg.friend.getPerModulesData(this);

			if (data.lastNadenadeAt != today) {
				data.lastNadenadeAt = today;
				msg.friend.setPerModulesData(this, data);

				msg.friend.incLove();
			}
		}
		//#endregion

		msg.reply(
			msg.friend.love >= 10 ? serifs.core.nadenade.love3 :
			msg.friend.love >= 5 ? serifs.core.nadenade.love2 :
			msg.friend.love <= -15 ? serifs.core.nadenade.hate4 :
			msg.friend.love <= -10 ? serifs.core.nadenade.hate3 :
			msg.friend.love <= -5 ? serifs.core.nadenade.hate2 :
			msg.friend.love <= -1 ? serifs.core.nadenade.hate1 :
			serifs.core.nadenade.normal
		);

		return true;
	}

	private kawaii = (msg: MessageLike): boolean => {
		if (!includes(msg.text, ['かわいい', '可愛い'])) return false;

		msg.reply(
			msg.friend.love >= 5 ? serifs.core.kawaii.love :
			msg.friend.love <= -3 ? serifs.core.kawaii.hate :
			serifs.core.kawaii.normal);

		return true;
	}

	private humu = (msg: MessageLike): boolean => {
		if (!includes(msg.text, ['踏んで'])) return false;

		// メッセージのみ
		if (!msg.isMessage) return true;

		msg.reply(
			msg.friend.love <= -3 ? serifs.core.humu.hate :
			serifs.core.humu.normal);

		return true;
	}

	private batou = (msg: MessageLike): boolean => {
		if (!includes(msg.text, ['罵倒して', '罵って'])) return false;

		// メッセージのみ
		if (!msg.isMessage) return true;

		msg.reply(
			msg.friend.love >= 5 ? serifs.core.batou.love :
			msg.friend.love <= -5 ? serifs.core.batou.hate :
			serifs.core.batou.normal);

		return true;
	}

	private ponkotu = (msg: MessageLike): boolean => {
		if (!includes(msg.text, ['ぽんこつ'])) return false;

		msg.friend.decLove();

		return true;
	}

	public onReplyThisModule = (msg: MessageLike, data: any) => {
		if (msg.text == null) return;

		const done = () => {
			msg.reply(serifs.core.setNameOk(msg.friend.name));
			this.ai.unsubscribeReply(this, msg.userId);
		};

		if (msg.text.includes('はい')) {
			msg.friend.updateName(data.name + 'さん');
			done();
		} else if (msg.text.includes('いいえ')) {
			msg.friend.updateName(data.name);
			done();
		} else {
			msg.reply(serifs.core.yesOrNo).then(reply => {
				this.ai.subscribeReply(this, msg.userId, msg.isMessage, reply.id, data);
			});
		}
	}
}
