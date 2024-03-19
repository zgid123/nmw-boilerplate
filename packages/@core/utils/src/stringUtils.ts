interface ICombineOptionsProps {
  joinWith: string;
}

interface IHumanizeOptionsProps {
  capitalize?: boolean;
}

function compact(source: (string | undefined)[]): string[] {
  return source.filter((s) => !!s) as string[];
}

export function combine(
  opts: ICombineOptionsProps | string | undefined = '',
  ...params: (string | undefined)[]
): string {
  let options: ICombineOptionsProps = { joinWith: ' ' };

  if (typeof opts === 'object') {
    options = opts;
  } else {
    params = [opts, ...params];
  }

  const { joinWith } = options;

  return compact(params).join(joinWith);
}

export function capitalize(data: string): string {
  return combine({ joinWith: '' }, data.charAt(0).toUpperCase(), data.slice(1));
}

export function humanize(
  source: string,
  opts: IHumanizeOptionsProps = {},
): string {
  const { capitalize: toCapitalize = false } = opts;
  const humanizedSource = (source || '')
    .replace(/_/g, ' ')
    .replace(/(?!^)[A-Z]/g, (replacement) => {
      return ` ${replacement}`;
    });

  if (toCapitalize) {
    return humanizedSource.toLowerCase().split(' ').map(capitalize).join(' ');
  }

  return humanizedSource;
}
