/*
eslint
@typescript-eslint/explicit-function-return-type: 0,
@typescript-eslint/no-explicit-any: 0
*/
import { assert } from 'chai'

interface ModelOptions {
  servicePath: string
}

describe('TypeScript Class Inheritance', () => {
  it('Can access static instanceDefaults from BaseModel', () => {
    abstract class BaseModel {
      public static instanceDefaults
      public constructor(data, options?) {
        const { instanceDefaults } = this.constructor as typeof BaseModel
        const defaults = instanceDefaults(data, options)
        assert(
          defaults.description === 'default description',
          'We get defaults in the BaseModel constructor'
        )
        Object.assign(this, defaults, data)
      }
    }
    class Todo extends BaseModel {
      public description: string

      public static instanceDefaults = (data, options) => ({
        description: 'default description'
      })

      public constructor(data, options?) {
        super(data, options)
        const { instanceDefaults } = this.constructor as typeof BaseModel
        const defaults = instanceDefaults(data, options)
        assert(
          defaults.description === 'default description',
          'We get defaults in the Todo constructor, too'
        )
      }
    }

    const todo = new Todo({
      test: true
    })

    assert(
      todo.description === 'default description',
      'got default description'
    )
  })

  it('Can access static instanceDefaults from two levels of inheritance', () => {
    abstract class BaseModel {
      public static instanceDefaults
      public constructor(data, options?) {
        const { instanceDefaults } = this.constructor as typeof BaseModel
        const defaults = instanceDefaults(data, options)
        assert(
          defaults.description === 'default description',
          'We get defaults in the BaseModel constructor'
        )
        Object.assign(this, defaults, data)
      }
    }

    function makeServiceModel(options) {
      const { servicePath } = options

      class ServiceModel extends BaseModel {
        public constructor(data, options: ModelOptions = { servicePath: '' }) {
          options.servicePath = servicePath
          super(data, options)
        }
      }
      return ServiceModel
    }

    class Todo extends makeServiceModel({ servicePath: 'todos' }) {
      public description: string

      public static instanceDefaults = (data, options) => ({
        description: 'default description'
      })
    }

    const todo = new Todo({
      test: true
    })

    assert(
      todo.description === 'default description',
      'got default description'
    )
  })

  it('Can access static servicePath from Todo in BaseModel', () => {
    abstract class BaseModel {
      public static instanceDefaults
      public static servicePath
      public static namespace

      public constructor(data, options?) {
        const { instanceDefaults, servicePath, namespace } = this
          .constructor as typeof BaseModel
        const defaults = instanceDefaults(data, options)
        assert(
          defaults.description === 'default description',
          'We get defaults in the BaseModel constructor'
        )
        Object.assign(this, defaults, data, {
          _options: { namespace, servicePath }
        })
      }
    }

    class Todo extends BaseModel {
      public static namespace: string = 'todos'
      public static servicePath: string = 'v1/todos'

      public description: string
      public _options

      public static instanceDefaults = (data, models) => ({
        description: 'default description'
      })
    }

    const todo = new Todo({
      test: true
    })

    assert(todo._options.servicePath === 'v1/todos', 'got static servicePath')
  })
})