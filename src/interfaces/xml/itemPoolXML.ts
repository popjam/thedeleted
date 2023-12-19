/**
 * Interface for lua transcription of itemPools from itempools.xml. Use the type 'ItemPoolsXML'
 * instead.
 */
export interface ItemPoolXML {
  _attr: {
    Name: string;
  };
  Item: Array<{
    _attr: {
      Id?: string;
      Name?: string;
      DecreaseBy: string;
      Weight: string;
      RemoveOn: string;
    };
  }>;
}

/** Interface for lua transcription of itempools.xml. */
export type ItemPoolsXML = ItemPoolXML[];
