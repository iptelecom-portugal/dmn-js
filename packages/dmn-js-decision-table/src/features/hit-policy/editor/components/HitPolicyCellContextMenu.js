import { Component } from 'inferno';

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

const HIT_POLICIES = [
  'UNIQUE',
  'FIRST',
  'PRIORITY',
  'ANY',
  'COLLECT',
  'RULE ORDER',
  'OUTPUT ORDER'
];

const LIST_FUNCTIONS = [
  'SUM',
  'MIN',
  'MAX',
  'COUNT'
];


export default class HitPolicyCellContextMenu extends Component {

  constructor(props, context) {
    super(props, context);

    this.onHitPolicyChange = this.onHitPolicyChange.bind(this);
    this.onAggregationChange = this.onAggregationChange.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onHitPolicyChange(hitPolicy) {
    this._modeling.editHitPolicy(hitPolicy, undefined);
  }

  onAggregationChange(value) {
    let aggregation = value === ''
      ? undefined
      : value;

    this._modeling.editHitPolicy('COLLECT', aggregation);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    const changeSupport = this._changeSupport = this.context.changeSupport;

    this._sheet = injector.get('sheet');
    this._modeling = injector.get('modeling');

    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy,
          aggregation = businessObject.aggregation;

    changeSupport.onElementsChanged(root.id, this.onElementsChanged);

    this.state = {
      hitPolicy,
      aggregation
    };
  }

  componentWillUnmount() {
    const root = this._sheet.getRoot();

    this._changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy,
          aggregation = businessObject.aggregation;

    const hitPolicyOptions = HIT_POLICIES.map(h => {
      return {
        label: h,
        value: h
      };
    });

    const aggregationOptions = LIST_FUNCTIONS.map(l => {
      return {
        label: l === 'NONE' ? '-' : l,
        value: l
      };
    });

    return (
      <div className="context-menu-container hit-policy-edit">
        <p className="hit-policy-edit-policy">
          <label className="dms-label">Hit Policy:</label>

          <InputSelect
            className="hit-policy-edit-policy-select"
            onChange={ this.onHitPolicyChange }
            options={ hitPolicyOptions }
            value={ hitPolicy } />
        </p>
        {
          hitPolicy === 'COLLECT' &&
            <p className="hit-policy-edit-operator">
              <label className="dms-label">Aggregation:</label>

              <InputSelect
                className="hit-policy-edit-operator-select"
                onChange={ this.onAggregationChange }
                options={ aggregationOptions }
                value={ aggregation } />
            </p>
        }
      </div>
    );
  }
}