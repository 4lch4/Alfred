import { config } from 'dotenv'
import { api as HueAPI, discovery, v3 } from 'node-hue-api'
import { join } from 'path'

config({ path: join(__dirname, '..', '.env') })

const LightState = v3.lightStates.LightState
const LightName = 'Office-Desk-Lamp'
const authInfo = {
  userId: process.env.BRIDGE_USER_ID,
  userKey: process.env.BRIDGE_USER_KEY
}
// const appName = 'alfred'
// const deviceName = 'office-door-in-00'

async function main() {
  try {
    const bridge = await discoverBridge()

    if (bridge) {
      // Create a LightState object for the on state.
      const onState = new LightState()
        .on()
        .rgb(255, 0, 0)
        .brightness(75)

      // const offState = new LightState().off()

      // Create an unauthenticated connection to the Hue Bridge.
      const client = await HueAPI.createLocal(bridge.ipaddress).connect(
        authInfo.userId,
        authInfo.userKey
      )

      // Create a new User to make use of the Bridge.
      // const user = await uApi.users.createUser(appName, deviceName)

      const light = (await client.lights.getLightByName(LightName))[0]
      const tmpRes = await client.lights.setLightState(light.id, onState)

      console.log(`light...`)
      console.log(light)

      console.log(`setRes...`)
      console.log(tmpRes)
    } else console.error('❌ No bridge discovered.')
  } catch (error) {
    console.error(error)
    console.error(`Failure executing...`)
    throw error
  }
}

async function discoverBridge() {
  try {
    const bridge = await discovery.nupnpSearch()

    if (bridge && bridge.length > 0) return bridge[0]
    else return undefined
  } catch (error) {
    throw error
  }
}

main()
  .then(res => {
    console.log(res)
    console.log(`✅ Execution complete.`)
  })
  .catch(err => {
    console.error(err)
    console.error(`❌ Execution failed.`)
  })
