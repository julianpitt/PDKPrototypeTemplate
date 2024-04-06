import { Box, SpaceBetween } from '@cloudscape-design/components';

const TableEmpty = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) => (
  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>{title}</b>
        <Box variant="p" color="inherit">
          {description}
        </Box>
      </div>
      {children}
    </SpaceBetween>
  </Box>
);

export default TableEmpty;
