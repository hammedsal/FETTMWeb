export class TTMPriceDto {
    id: number = -1;
    price: number = 0;
    newprice: string = '';
    tag: string = '';
    track: string = '';
    section: string = '';
    plan: string = '';
    date: string = '01/01/2000 00:00';

    // public get entityId() : number {
    //     return this.id;
    // }
     
    
    // public get entityName() : string {
    //     return this.track + '/' + this.tag;
    // }
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

export const TTMPriceColumns = [
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
        key: 'tag',
        type: 'text',
        label: 'תווית',
        required: true,
        style: 'normal'
      },
      {
        key: 'track',
        type: 'text',
        label: 'מסלול',
        required: true,
        style: 'normal'
      },
      {
        key: 'section',
        type: 'text',
        label: 'לקוח/קבלן',
        required: true,
        style: 'normal'
      },
      {
        key: 'plan',
        type: 'text',
        label: 'הובלה/יחידה',
        required: true,
        style: 'normal'
      },
      {
        key: 'date',
        type: 'date',
        label: 'ת.עדכון',
        required: true,
        style: 'normal'
      },
      {
        key: 'isEdit',
        type: 'isEdit',
        label: '',
        required: true,
        style: 'button'
      },
  ];

