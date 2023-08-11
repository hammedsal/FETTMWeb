export class TTMPriceDto {
    id: number = -1;
    price: number = 0;
    newprice: number = 0;
    tag: string = '';
    track: string = '';
    section: string = '';
    plan: string = '';
    date: string = '01/01/2000 00:00';

}

/*
            "id": 2, // idx = 0
            "price": 20, // idx = 1
            "tag": "יחידה", // idx = 2
            "track": "T11", // idx = 3
            "section": "S1", // idx = 4
            "plan": "U", // idx = 5
            "date": "01/01/2000 00:00" // idx = 6
*/

export const TTMPriceDisplayedColumnKeys = ['track', 'tag', 'section', 'plan', 'price', 'newprice', 'date' ];

export const TTMPriceColumnDefinitions = [
  {
      key: 'id',
      type: 'number',
      label: 'מזהה',
      required: false,
      style: 'hidden'
    },
    {
      key: 'price',
      type: 'number',
      label: 'מחיר',
      required: true,
      style: 'normal'
    },
    {
      key: 'newprice',
      type: 'number',
      label: 'מחיר מעודכן',
      required: true,
      style: 'normal'
    },
    {
      key: 'tag',
      type: 'text',
      label: 'שם תמחיר',
      required: true,
      style: 'normal'
    },
    {
      key: 'track',
      type: 'text',
      label: 'שם מסלול',
      required: true,
      style: 'normal'
    },
    {
      key: 'section',
      type: 'text',
      label: 'סוג מחיר',
      required: true,
      style: 'normal'
    },
    {
      key: 'plan',
      type: 'text',
      label: 'שיטת חישוב',
      required: true,
      style: 'normal'
    },
    {
      key: 'date',
      type: 'date',
      label: 'עדכון אחרון',
      required: true,
      style: 'normal'
    }
];

