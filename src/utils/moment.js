import moment from 'moment-timezone';

moment.locale('de');
moment.defaultFormat = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
moment.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';

export default moment;
