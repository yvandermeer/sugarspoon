tests = [
    'calculator',
    'someview'
]

# Help guarantee the order of suite execution
define ("test/spec/#{test}" for test in tests), ->
    suite?() for suite in arguments
