import {
  containerImageRegex,
  RESOURCE_NAME_REGEX_MSG,
  resourceNameRegex,
  reviewValidationSchema,
} from '../validation-utils';

const resourceLimits = {
  min: {
    cpu: '10',
    cpuUnit: 'millicores',
    memory: '256',
    memoryUnit: 'Mi',
  },
  max: {
    cpu: '2',
    cpuUnit: 'cores',
    memory: '2',
    memoryUnit: 'Gi',
  },
};

describe('Review form validation schema', () => {
  it('should fail when no component is selected', async () => {
    await expect(
      reviewValidationSchema.validate({
        application: 'my-app',
        components: [
          {
            componentStub: {
              componentName: 'test-comp',
              resources: {
                cpu: 1,
                memory: 255,
              },
              source: {
                git: {
                  dockerfileUrl: './Dockerfile',
                },
              },
            },
          },
        ],
        selectedComponents: [false],
        isDetected: true,
        resourceLimits,
      }),
    ).rejects.toThrow(' ');
  });

  it('should fail when component name is missing', async () => {
    await expect(
      reviewValidationSchema.validate({
        application: 'my-app',
        components: [
          {
            componentStub: {
              targetPort: 8000,
            },
          },
        ],
        selectedComponents: [true],
        isDetected: true,
        resourceLimits,
      }),
    ).rejects.toThrow('Required');
  });

  it('should fail when component name is invalid', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test comp',
            targetPort: 8000,
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
    values.components[0].componentStub.componentName = 'Test-';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
    values.components[0].componentStub.componentName = 'test-@!';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
    values.components[0].componentStub.componentName = '-test';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
    values.components[0].componentStub.componentName = '1-test';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
  });

  it('should pass when target port is not provided', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: './Dockerfile',
              },
            },
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
  });

  it('should fail when target port is invalid', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            targetPort: 'test',
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow('Must be an integer');
  });

  it('should fail when target port is in invalid range', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            targetPort: '0',
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Port must be between 1 and 65535.',
    );
  });

  it('should fail when target port is in invalid range', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            targetPort: '65536',
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Port must be between 1 and 65535.',
    );
  });

  it('should fail when resource unit is negative', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: -1,
              memory: 256,
            },
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must be greater than 0',
    );
  });
  it('should pass when dockerfileUrl is not provided', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: undefined,
              },
            },
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
  });
  it('should pass when dockerfileUrl is a url', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: 'https://www.someurl.com/test',
              },
            },
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'http://www.someurl.com/test';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl =
      'http://www.someurl.com:9000/test';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'htp://test';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Must be a valid relative file path or URL.',
    );
  });
  it('should pass when dockerfileUrl is a relative path', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: './Dockerfile',
              },
            },
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = '../Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'directory/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'directory/Dockerfile.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = '.hidden/Dockerfile.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = '.Dockerfile.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'Dockerfile.something.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'Dockerfile.something.else.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'Dockerfile.bad.';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Must be a valid relative file path or URL.',
    );

    values.components[0].componentStub.source.git.dockerfileUrl = '/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Must be a valid relative file path or URL.',
    );
  });

  it('should pass when dockerfileUrl is a URL', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: 'https://www.test.com/Dockerfile',
              },
            },
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl =
      'https://www.test.com/directory/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl =
      'https://www.test.com/directory/Dockerfile.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl =
      'https://www.test.com:4000/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'http://www.test.com/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'www.test.com/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
  });
  it('should show errors based on selected unit', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              cpuUnit: 'cores',
              memory: 255,
              memoryUnit: 'Mi',
            },
            source: {
              git: {
                dockerfileUrl: 'https://www.test.com/Dockerfile',
              },
            },
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };

    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
    values.components[0].componentStub.resources.memory = 5;
    values.components[0].componentStub.resources.memoryUnit = 'Gi';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 2Gi',
    );

    values.components[0].componentStub.resources.memory = 3072; //3gb
    values.components[0].componentStub.resources.memoryUnit = 'Mi';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 2048Mi',
    );

    values.components[0].componentStub.resources.memory = 2;
    values.components[0].componentStub.resources.cpu = 10;
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 2 cores',
    );

    values.components[0].componentStub.resources.cpu = 20000;
    values.components[0].componentStub.resources.cpuUnit = 'millicores';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 2000 millicores',
    );
  });
  it('should use cluster default resource limit as max value', async () => {
    const values = {
      application: 'my-app',
      detectedComponents: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {},
            source: {
              git: {
                dockerfileUrl: 'https://www.test.com/Dockerfile',
              },
            },
          },
        },
      ],
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              cpuUnit: 'cores',
              memory: 255,
              memoryUnit: 'Mi',
            },
            source: {
              git: {
                dockerfileUrl: 'https://www.test.com/Dockerfile',
              },
            },
          },
        },
      ],
      selectedComponents: [true],
      isDetected: true,
      resourceLimits,
    };

    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    // should throw errors if cpu and memory limit is exceeded from cluster default resource limit
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
    values.components[0].componentStub.resources.memory = 6000;
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 2048Mi',
    );

    values.components[0].componentStub.resources.memory = 256;
    values.components[0].componentStub.resources.cpu = 10;
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 2 cores',
    );
  });
});

describe('containerImageRegex', () => {
  it('should validate a container image url starting with https:// or quay.io/', () => {
    expect('https://quay.io/example/repo').toMatch(containerImageRegex);
    expect('quay.io/example/repo').toMatch(containerImageRegex);
  });

  it('should not validate a non-quay container image url', () => {
    expect('https://docker.io/example/repo').not.toMatch(containerImageRegex);
    expect('quay.com/example/repo').not.toMatch(containerImageRegex);
  });
});

describe('resourceNameRegex', () => {
  it('should not allow names starting with number', () => {
    ['1test-name', '123resource'].forEach((str) => {
      expect(str).not.toMatch(resourceNameRegex);
    });
  });

  it('should not allow special characters', () => {
    ['resource-@$*-name', 'test-namé'].forEach((str) => {
      expect(str).not.toMatch(resourceNameRegex);
    });
  });
});
