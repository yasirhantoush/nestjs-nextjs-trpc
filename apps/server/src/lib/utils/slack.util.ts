import axios from 'axios';
import { getTopicName } from '../helpers';
import { giveMeClassLogger } from '../winston.logger';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

const slack_app_url = `https://hooks.slack.com/services/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`

export async function sendSlackMessage(text: string) {
    const response = await axios.post(slack_app_url, {text});
    return response?.data;
}
