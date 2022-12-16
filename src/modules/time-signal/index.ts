import autobind from 'autobind-decorator';
import Module from '@/module';
import serifs from '@/serifs';
import cron from 'node-cron';


export default class extends Module {
	public readonly name = 'timeSignal';

	@autobind
	public install() {
		cron.schedule('0 0 0 * * *', () => this.timeSignal);

		return {};
	}

	@autobind
	private timeSignal() {
		const today = new Date();
		const monthday = `${today.getMonth()+1}, ${today.getDate()}`;

		if(monthday !== '1, 1'){
			this.ai.post({
				text: serifs.timeSignal.text
			});
		}else{
			this.ai.post({
				text: serifs.timeSignal.newYear
			});
		}
	}
}
