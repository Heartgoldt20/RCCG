import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import net from 'node:net';

test('unconfigured portal does not accept accounts or expose protected pages', async () => {
  const socket = net.createServer();
  await new Promise(resolve => socket.listen(0,'127.0.0.1',resolve));
  const port = Number(process.env.PORTAL_TEST_PORT || socket.address().port);
  await new Promise(resolve => socket.close(resolve));
  const env = {...process.env};
  delete env.SUPABASE_URL; delete env.SUPABASE_PUBLISHABLE_KEY; delete env.PORTAL_SITE_URL;
  const server = spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p',String(port)],{env,stdio:['ignore','pipe','pipe']});
  let logs=''; server.stdout.on('data',d=>logs+=d); server.stderr.on('data',d=>logs+=d);
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false, last='';
    for(let attempt=0;attempt<30;attempt++) {
      try { const response=await fetch(base+'/portal',{signal:AbortSignal.timeout(2000)}); if(response.ok) {ready=true;break;} last='HTTP '+response.status; } catch(e) {last=String(e);}
      await delay(100);
    }
    assert.ok(ready,'production server should start: '+last+' '+logs);
    const landing = await fetch(base+'/portal',{signal:AbortSignal.timeout(2000)});
    assert.equal(landing.status,200);
    assert.match(await landing.text(),/Create an account/);
    for(const route of ['login','register','forgot-password']) {
      const response=await fetch(base+'/portal/'+route,{signal:AbortSignal.timeout(3000)});
      assert.equal(response.status,200);
      assert.match(response.headers.get('cache-control'),/no-store/);
      const html=await response.text();
      assert.match(html,/Online accounts are coming soon/);
      assert.match(html,/<fieldset disabled/);
    }
    for(const route of ['dashboard','reset-password','confirm']) {
      const response=await fetch(base+'/portal/'+route,{redirect:'manual',signal:AbortSignal.timeout(3000)});
      assert.ok([307,308].includes(response.status));
      assert.ok(response.headers.get('location').endsWith('/portal/login'));
    }
    const home=await fetch(base,{signal:AbortSignal.timeout(3000)});
    assert.match(await home.text(),/Member portal/);
  } finally {
    server.kill('SIGTERM');
    if(server.exitCode===null) {
      await Promise.race([new Promise(resolve => server.once('exit',resolve)),delay(1000)]);
      if(server.exitCode===null) server.kill('SIGKILL');
    }
  }
});
