import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import styled from "styled-components"
import colors from "../../utils/style/colors"
import { Loader } from "../../utils/style/Atoms"
import { useContext } from "react"
import { ThemeContext, SurveyContext } from "../../utils/context"

const SurveyContainer = styled.div.attrs(props => ({ className: 'page borderBoxSizing' }))`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const QuestionTitle = styled.h2`
  text-decoration: underline;
  text-decoration-color: ${colors.primary};
`

const QuestionContent = styled.span`
  margin: 30px;
`

const LinkWrapper = styled.div`
  padding-top: 30px;
  & a {
    color: ${({ $isDarkMode }) => $isDarkMode ? 'white' : 'black'};
  }
  & a:first-of-type {
    margin-right: 20px;
  }
`

const ReplyBox = styled.button`
  border: none;
  height: 100px;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: ${(props) =>
    props.isSelected ? `0px 0px 0px 2px ${colors.primary} inset` : 'none'};
  &:first-child {
    margin-right: 15px;
  }
  &:last-of-type {
    margin-left: 15px;
  }
`

const ReplyWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

export default function Survey() {
  let { questionNumber } = useParams()
  questionNumber = Number.parseInt(questionNumber)
  const [questions, setQuestions] = useState({})
  const [isDataLoading, setDataLoading] = useState(false)
  const { theme } = useContext(ThemeContext)
  const { answers, saveAnswers } = useContext(SurveyContext)

  function saveReply(answer) {
    saveAnswers({ [questionNumber]: answer })
  }
  
  useEffect(() => {
    setDataLoading(true)
    fetch(`http://localhost:8000/survey`)
      .then((response) => response.json())
      .then(({ surveyData }) => {
        setQuestions({ ...surveyData })
        setDataLoading(false)
      })
      .catch((error) => console.log(error))
  }, [])
  return (
    <SurveyContainer>
      <QuestionTitle>Question {questionNumber}</QuestionTitle>
      {isDataLoading ? (
        <Loader />
      ) : (
        <QuestionContent>{questions[questionNumber]}</QuestionContent>
      )}
      <ReplyWrapper>
        <ReplyBox
          onClick={() => saveReply(true)}
          isSelected={answers[questionNumber] === true}
        >
          Oui
        </ReplyBox>
        <ReplyBox
          onClick={() => saveReply(false)}
          isSelected={answers[questionNumber] === false}
        >
          Non
        </ReplyBox>
      </ReplyWrapper>
      <LinkWrapper $isDarkMode={theme === 'dark'}>
        {questionNumber >= 1 && (<Link to={`/survey/${questionNumber - 1}`}>Question précédente</Link>)}
        {questions[questionNumber + 1] ? (
          <Link to={`/survey/${questionNumber + 1}`}>Question suivante</Link>
        ) : (
          <Link to="/results">Résultats</Link>
        )}
      </LinkWrapper>
    </SurveyContainer>
  )
}