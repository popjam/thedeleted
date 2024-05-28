/** Interface for lua transcription of itempools.xml via Repentogon. */
export interface ItemPoolsXML {
  name: string;
  sourceid: string;
  item: Array<{
    id: string;
    decreaseBy: string;
    weight: string;
    removeOn: string;
  }>;
}
