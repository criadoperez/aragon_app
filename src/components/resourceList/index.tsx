import {ListItemLink} from '@aragon/ods-old';
import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';

import {StateEmpty} from 'components/stateEmpty';
import {ProposalResource} from 'utils/types';
import {Icon, IconType} from '@aragon/ods';

type ResourceListProps = {
  links?: Array<ProposalResource>;
  emptyStateButtonClick?: () => void;
};

const ResourceList: React.FC<ResourceListProps> = ({
  links = [],
  emptyStateButtonClick,
}) => {
  const {t} = useTranslation();

  if (links.length > 0) {
    return (
      <Container data-testid="resourceList">
        <Title>{t('labels.resources')}</Title>
        <ListItemContainer>
          {links.map((link, index) => (
            <ListItemLink label={link.name} href={link.url} key={index} />
          ))}
        </ListItemContainer>
      </Container>
    );
  }

  return (
    <Container>
      <StateEmpty
        type="Object"
        mode="inline"
        object="archive"
        title={t('labels.noResources')}
        secondaryButton={
          emptyStateButtonClick
            ? {
                label: t('labels.addResource'),
                onClick: emptyStateButtonClick,
                iconLeft: <Icon icon={IconType.ADD} />,
              }
            : undefined
        }
      />
    </Container>
  );
};

export default ResourceList;

const Container = styled.div.attrs({
  className: 'p-6 bg-neutral-0 rounded-xl',
})``;

const Title = styled.p.attrs({
  className: 'ft-text-xl font-semibold text-neutral-800',
})``;

const ListItemContainer = styled.div.attrs({className: 'mt-6 space-y-4'})``;
