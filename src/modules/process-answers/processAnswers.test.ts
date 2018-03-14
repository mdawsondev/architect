import processAnswers from './processAnswers.module';

test('return input as output', () => {
  expect( processAnswers({"test": "test"}) ).toEqual({"test": "test"});
});

test('process git y as git 1', () => {
  expect( processAnswers({"git": "y"}) ).toEqual({"git": 1});
});

test('process git string as git 0', () => {
  expect( processAnswers({"git": "asdfasdf"}) ).toEqual({"git": 0});
});

test('process git number as git 0', () => {
  expect( processAnswers({"git": 10}) ).toEqual({"git": 0});
});