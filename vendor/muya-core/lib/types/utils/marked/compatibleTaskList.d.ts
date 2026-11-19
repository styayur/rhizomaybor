import type { Tokens as MuyaTypeImport0 } from 'marked';
import { Token } from 'marked';
import { ListItemToken, ListToken } from './types';
declare function compatibleTaskList(tokens?: (Token | ListToken | ListItemToken)[]): (MuyaTypeImport0.Heading | MuyaTypeImport0.ListItem | MuyaTypeImport0.List | MuyaTypeImport0.Blockquote | MuyaTypeImport0.Br | MuyaTypeImport0.Code | MuyaTypeImport0.Codespan | MuyaTypeImport0.Def | MuyaTypeImport0.Del | MuyaTypeImport0.Em | MuyaTypeImport0.Escape | MuyaTypeImport0.Hr | MuyaTypeImport0.HTML | MuyaTypeImport0.Image | MuyaTypeImport0.Link | MuyaTypeImport0.Paragraph | MuyaTypeImport0.Space | MuyaTypeImport0.Strong | MuyaTypeImport0.Table | MuyaTypeImport0.Tag | MuyaTypeImport0.Text | MuyaTypeImport0.Generic)[];
export default compatibleTaskList;
