import { memo, useEffect } from 'react'
import { Button } from 'antd'
import { useAuthStore } from '../stores/auth.store'

const ButtonSocialMedias = () => {
  const { signinWithSocialMedia, signinPassportSuccess } = useAuthStore()

  const handleLoginWithGoogle = () => {
    signinWithSocialMedia('google')
  }
  const handleLoginWithGithub = () => {
    signinWithSocialMedia('github')
  }
  useEffect(() => {
    ;(async () => {
      await signinPassportSuccess()
    })()
  }, [])

  return (
    <>
      {/* {signinPassportSuccessResult.isLoading && <div>Loading...</div>} */}
      <div className="flex gap-4">
        <Button type="primary" onClick={handleLoginWithGoogle}>
          Sigin with google
        </Button>
        <Button type="primary" onClick={handleLoginWithGithub}>
          Sigin with github
        </Button>
      </div>
    </>
  )
}

export default memo(ButtonSocialMedias)
