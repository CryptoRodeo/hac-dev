export const mockCDQ = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'ComponentDetectionQuery',
  metadata: {
    creationTimestamp: '2022-06-01T19:46:56Z',
    generation: 1,
    name: 'test-cdq',
    namespace: 'test-ns',
    resourceVersion: '549461773',
    uid: 'fdd0975f-7f53-44e5-94bd-fcc2bde719ef',
  },
  spec: {
    git: {
      url: 'https://github.com/nodeshift-starters/devfile-sample.git',
    },
  },
  status: {
    componentDetected: {
      nodejs: {
        componentStub: {
          application: 'insert-application-name',
          componentName: 'nodejs',
          resources: {},
          source: {
            git: {
              context: './',
              url: 'https://github.com/nodeshift-starters/devfile-sample.git',
            },
          },
        },
        devfileFound: true,
        language: 'nodejs',
        projectType: 'nodejs',
      },
    },
    conditions: [
      {
        lastTransitionTime: '2022-06-01T19:46:56Z',
        message: 'ComponentDetectionQuery is processing',
        reason: 'Success',
        status: 'True',
        type: 'Processing',
      },
      {
        lastTransitionTime: '2022-06-01T19:46:56Z',
        message: 'ComponentDetectionQuery has successfully finished',
        reason: 'OK',
        status: 'True',
        type: 'Completed',
      },
    ],
  },
};

export const mockEmptyCDQ = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'ComponentDetectionQuery',
  metadata: {
    name: 'test-cdq',
    namespace: 'test-ns',
  },
  spec: {
    git: {
      url: 'https://github.com/example/empty-repo',
    },
  },
  status: {
    conditions: [
      {
        lastTransitionTime: '2022-06-01T19:46:56Z',
        message: 'ComponentDetectionQuery is processing',
        reason: 'Success',
        status: 'True',
        type: 'Processing',
      },
      {
        lastTransitionTime: '2022-06-01T19:46:56Z',
        message: 'ComponentDetectionQuery has successfully finished',
        reason: 'OK',
        status: 'True',
        type: 'Completed',
      },
    ],
  },
};

export const mockFailedCDQ = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'ComponentDetectionQuery',
  metadata: {
    name: 'test-cdq',
    namespace: 'test-ns',
  },
  spec: {
    git: {
      url: 'https://github.com/openshift/dynamic-plugin-sdk/tree/main/packages/sample-app',
    },
  },
  status: {
    conditions: [
      {
        lastTransitionTime: '2022-06-01T19:46:56Z',
        message: 'ComponentDetectionQuery is processing',
        reason: 'Success',
        status: 'True',
        type: 'Processing',
      },
      {
        lastTransitionTime: '2022-06-01T19:46:56Z',
        message: 'Error when cloning repository',
        reason: 'Error',
        status: 'True',
        type: 'Completed',
      },
    ],
  },
};

export const mockDetectedComponent = mockCDQ.status.componentDetected;
