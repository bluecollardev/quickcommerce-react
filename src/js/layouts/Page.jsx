const PageLayout = (props) => {
  if (props.loggedIn === true) {
    return (
      <main id='page-wrap' className='container-fluid'>
        <Row>
          {!props.displaySidebar && (
            <Col xs={12} sm={12} md={12} lg={12} id='main-content'>
              <Paper>
                {props.children}
              </Paper>
            </Col>
          )}

          {props.displaySidebar && (
            <Col xs={12} sm={9} md={9} lg={9} id='main-content'>
              <Paper>
                {props.children}
              </Paper>
            </Col>
          )}

          {props.displaySidebar && (
            <Col xs={12} sm={3} md={3} lg={3} id='sidebar-right' style={{ paddingTop: '2rem' }}>
              <Card>
                <CardHeader
                  title='Moneypenny'
                  subheader='Behave, James...'
                  avatar={<Avatar src='https://upload.wikimedia.org/wikipedia/en/9/9b/Miss_Moneypenny_by_Lois_Maxwell.jpg'/>}
                />
                <CardMedia image='images/nature-600-337.jpg'/>
                <CardContent>
                  <small>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                  </small>
                </CardContent>
                <CardActions>
                  <Button>View</Button>
                  <Button>Dismiss</Button>
                </CardActions>
              </Card>

              <hr/>

              <Card>
                <CardHeader
                  title='System'
                  subheader='Blah blah blah'
                />
                <CardMedia image='images/nature-600-337.jpg'/>
                <CardContent>
                  <small>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                  </small>
                </CardContent>
                <CardActions>
                  <Button>View</Button>
                  <Button>Dismiss</Button>
                </CardActions>
              </Card>

              <hr/>

              <Card>
                <CardHeader
                  title='Moneypenny'
                  subheader='From Russia with love'
                  avatar={<Avatar src='https://upload.wikimedia.org/wikipedia/en/9/9b/Miss_Moneypenny_by_Lois_Maxwell.jpg'/>}
                />
                <CardMedia image='images/nature-600-337.jpg'/>
                <CardContent>
                  <small>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                  </small>
                </CardContent>
                <CardActions>
                  <Button>View</Button>
                  <Button>Dismiss</Button>
                </CardActions>
              </Card>

              <hr/>

              <Card>
                <CardHeader
                  title='System'
                  subheader='Just a random notice'
                />
                <CardMedia image='images/nature-600-337.jpg'/>
                <CardContent>
                  <small>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                  </small>
                </CardContent>
                <CardActions>
                  <Button>View</Button>
                  <Button>Dismiss</Button>
                </CardActions>
              </Card>
            </Col>
          )}
        </Row>
      </main>
    )
  } else {
    return (
      <main id='page-wrap' className='container-fluid'>
        <Row>
          <Col xs={12} id='main-content'>
            <Paper>
              {props.children}
            </Paper>
          </Col>
          <Col xs={12} id='sidebar-right'>
          </Col>
        </Row>
      </main>
    )
  }
}

export default PageLayout
